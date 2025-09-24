import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";
const [showExtraTable, setShowExtraTable] = useState(false);

const UserTotal = () => {
    const [users, setUsers] = useState([]);
    const [searchTop, setSearchTop] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
                                    placeholder="이름 검색"
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
                                            <td colSpan="5" className="empty">회원이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user, idx) => (
                                            <tr key={idx}>
                                                <td>{user.name || "이름"}</td>
                                                <td>{user.email || "아이디"}</td>
                                                <td>
                                                    {user.createdAt
                                                        ? new Date(user.createdAt)
                                                            .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
                                                            .replace(/\. /g, ".")
                                                            .replace(/\.$/, "")
                                                        : "가입일"}
                                                </td>
                                                <td>{user.measurementCount ?? 0}</td>
                                                <td>{user.measurementInfo || "-"}</td>
                                                <button
    onClick={() => setShowExtraTable(prev => !prev)}
    className="toggle-btn"
>
    {showExtraTable ? "닫기" : "+"}
</button>

{showExtraTable && (
    <table className="listTable extra-table">
        <thead>
            <tr>
                <th>추가 항목</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>데이터</td>
            </tr>
        </tbody>
    </table>
)}

                                            </tr>
                                        ))
                                    )}
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
