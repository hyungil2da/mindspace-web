import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";

const UserTotal = () => {
    const [users, setUsers] = useState([]);
    const [searchTop, setSearchTop] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // 펼침 상태(한 번에 한 행만 펼치는 형태)
    const [expandedUserId, setExpandedUserId] = useState(null);
    // 더미 측정값 저장소: { [userId]: Array<measurement> }
    const [measurementMap, setMeasurementMap] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5001/api/users")
            .then((res) => {
                const allUsers = res.data.users || [];
                setUsers(allUsers);
            })
            .catch((err) => {
                console.error("회원정보 불러오기 실패:", err);
            });
    }, []);

    // 검색 적용
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTop.toLowerCase())
    );

    // 페이지별 데이터
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // 검색 시 페이지 초기화
    const handleSearchChange = (e) => {
        setSearchTop(e.target.value);
        setCurrentPage(1);
    };

    // 더미 측정값 생성기: 호출 시 userId에 대해 최근 10개 이하 가짜 데이터 만듦
    function ensureDummyMeasurements(userId, countHint = 6) {
        setMeasurementMap((prev) => {
            if (prev[userId]) return prev; // 이미 있으면 유지
            const now = Date.now();
            const count = Math.min(Math.max(countHint, 3), 10); // 3~10 사이
            const dummy = Array.from({ length: count }).map((_, i) => {
                const ts = new Date(now - (count - 1 - i) * 60 * 60 * 1000); // 1시간 간격
                // 0~1 범위 랜덤 점수(소수 둘째 자리)
                const r = () => Math.round(Math.random() * 100) / 100;
                return {
                    timestamp: ts.toISOString(),
                    depression: r(),
                    anxiety: r(),
                    stress: r(),
                    anger: r(),
                    stability: r(),
                };
            });
            return { ...prev, [userId]: dummy };
        });
    }

    // 서버 연동: 행 토글 시 해당 유저의 최근 감정 기록을 가져옴
    async function handleToggleDetail(user) {
        const next = expandedUserId === user._id ? null : user._id;
        setExpandedUserId(next);

        if (next && !measurementMap[user._id]) {
            try {
                const url = `http://localhost:5001/api/users/recent-emotions/${user._id}`;
                const res = await axios.get(url);
                const normalized = toMeasurementsFromRecentEmotions(res.data);
                setMeasurementMap((prev) => ({ ...prev, [user._id]: normalized }));
            } catch (err) {
                console.error("최근 감정 기록 불러오기 실패:", err);
                // 필요 시 임시 더미 사용:
                ensureDummyMeasurements(user._id, user.measurementCount ?? 6);
            }
        }
    }

    // recent-emotions 응답을 화면용 measurements 배열로 변환
    function toMeasurementsFromRecentEmotions(apiData) {
        const list = Array.isArray(apiData?.emotionResults) ? apiData.emotionResults : [];

        const parseTs = (d, t) => {
            // 날짜와 시간이 없거나 비정상일 때도 안전하게 처리
            const date = d || "1970-01-01";
            const time = t || "00:00:00";
            // 브라우저 파서가 안정적으로 읽도록 T 연결
            return new Date(`${date}T${time}`).getTime();
        };

        // 최신순 정렬(내림차순) 후 최대 10개
        const sorted = [...list].sort((a, b) => parseTs(b.date, b.time) - parseTs(a.date, a.time)).slice(0, 10);

        return sorted.map((item) => {
            const e = item.emotions || {};
            // 일부 키가 비어 있으면 0으로 기본값
            return {
                timestamp: `${item.date}T${item.time || "00:00:00"}`,
                depression: Number.isFinite(e.depression) ? e.depression : 0,
                anxiety: Number.isFinite(e.anxiety) ? e.anxiety : 0,
                stress: Number.isFinite(e.stress) ? e.stress : 0,
                anger: Number.isFinite(e.anger) ? e.anger : 0,
                stability: Number.isFinite(e.stability) ? e.stability : 0,
            };
        });
    }


    // 표 렌더를 위한 가로형 그리드(열=라벨 6개, 행=측정 N개)
    function buildGridData(measurements = []) {
        // 최근 10개만 사용, 최신이 위로 오도록 내림차순 정렬
        const rows = [...measurements]
            .slice(-10) // 최대 10개
            .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)); // 최신 → 오래된

        const formatKST = (iso) => {
            try {
                return new Date(iso)
                    .toLocaleString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    .replace(/\. /g, ".")
                    .replace(/\.$/, "");
            } catch {
                return iso;
            }
        };

        const header = ["날짜/시간", "우울", "불안", "스트레스", "분노", "안정"];

        const body = rows.map((m) => {
            const raw = [
                Number(m.depression ?? 0),
                Number(m.anxiety ?? 0),
                Number(m.stress ?? 0),
                Number(m.anger ?? 0),
                Number(m.stability ?? 0),
            ];
            const allZero = raw.every((v) => v === 0);
            const emotions = raw.map((v) => v.toFixed(2));

            // 상위 2개 인덱스 찾기
            let majorIdx = null;
            let minorIdx = null;
            if (!allZero) {
                const sorted = raw
                    .map((v, i) => ({ v, i }))
                    .sort((a, b) => b.v - a.v); // 값 내림차순
                majorIdx = sorted[0]?.i ?? null;
                minorIdx = sorted[1]?.i ?? null;
            }

            return {
                timestamp: formatKST(m.timestamp),
                emotions,   // ["0.00", "0.12", ...]
                allZero,
                majorIdx,
                minorIdx,
            };
        });

        return { header, body };
    }


    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <div className="DashLogo">MINDSPACE</div>
                <ul>
                    <li>
                        <NavLink to="/DashBoard" className={({ isActive }) => (isActive ? "active" : "")}>
                            대시보드
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/User" className={({ isActive }) => (isActive ? "active" : "")}>
                            사용자 관리
                        </NavLink>
                    </li>
                    {/*<li>
                        <NavLink to="/Post" className={({ isActive }) => (isActive ? "active" : "")}>
                            게시판 관리
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Statistics" className={({ isActive }) => (isActive ? "active" : "")}>
                            통계
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Setting" className={({ isActive }) => (isActive ? "active" : "")}>
                            설정
                        </NavLink>
                    </li>*/}
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                            홈페이지
                        </NavLink>
                    </li>
                </ul>
                <div className="card profile-card">
                    <div className="profile-image">사진</div>
                    <div className="profile-info">
                        <p>MARS</p>
                        <span>Mars1234@gmail.com</span>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <section className="Upper">
                    <section className="top">
                        <div className="card userlist-card">
                            <div className="search">
                                <NavLink to="/NewTotal" className={({ isActive }) => (isActive ? "active" : "")}>
                                    신규 회원 목록
                                </NavLink>
                                <NavLink to="/UserTotal" className={({ isActive }) => (isActive ? "active" : "")}>
                                    전체 사용자 목록
                                </NavLink>
                                <input
                                    type="text"
                                    placeholder="이름을 검색해 주세요"
                                    value={searchTop}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                            </div>
                            <table className="listTable">
                                <thead>
                                    <tr>
                                        <th className="namePart">이름</th>
                                        <th>아이디</th>
                                        <th>가입일</th>
                                        <th>검사횟수</th>
                                        <th>검사정보</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="empty">회원이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user, idx) => {
                                            const isOpen = expandedUserId === user._id;
                                            const measurements = measurementMap[user._id] || [];
                                            const grid = buildGridData(measurements);
                                            return (
                                                <React.Fragment key={user._id || idx}>
                                                    <tr>
                                                        <td>{user.name || "이름"}</td>
                                                        <td>{user.email || "아이디"}</td>
                                                        <td>
                                                            {user.createdAt ? new Date(user.createdAt)
                                                                .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
                                                                .replace(/\. /g, ".").replace(/\.$/, "") : "가입일"}
                                                        </td>
                                                        <td>{user.measurementCount ?? measurements.length ?? 0}</td>
                                                        <td>
                                                            {user.measurementInfo || (
                                                                <button className="px-2 py-1 border rounded" onClick={() => handleToggleDetail(user)}>
                                                                    {isOpen ? "접기" : "검사 기록 보기"}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {isOpen && (
                                                        <tr>
                                                            <td colSpan={5} className="p-0">
                                                                <div className="measurement-panel">
                                                                    <table className="measurement-table">
                                                                        <thead>
                                                                            <tr>
                                                                                {grid.header.map((h) => (
                                                                                    <th key={h} className="measurement-colhdr">{h}</th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {grid.body.length === 0 ? (
                                                                                <tr>
                                                                                    <td className="empty" colSpan={grid.header.length}>기록이 없습니다.</td>
                                                                                </tr>
                                                                            ) : (
                                                                                grid.body.map((row, rIdx) => (
                                                                                    <tr key={rIdx}>
                                                                                        <td className="measurement-cell">{row.timestamp}</td>
                                                                                        {row.allZero ? (
                                                                                            <td className="measurement-cell" colSpan={5}>
                                                                                                감정 결과가 출력 되지 않았습니다.
                                                                                            </td>
                                                                                        ) : (
                                                                                            row.emotions.map((cell, cIdx) => {
                                                                                                let extraClass = "";
                                                                                                if (cIdx === row.majorIdx) extraClass = "major-cell";
                                                                                                else if (cIdx === row.minorIdx) extraClass = "minor-cell";
                                                                                                return (
                                                                                                    <td key={cIdx} className={`measurement-cell ${extraClass}`}>
                                                                                                        {cell}
                                                                                                    </td>
                                                                                                );
                                                                                            })
                                                                                        )}
                                                                                    </tr>
                                                                                ))
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={currentPage === i + 1 ? "active" : ""}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
};

export default UserTotal;
