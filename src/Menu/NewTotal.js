// 신규 회원 전체 목록
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";

const UserTotal = () => {
    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState([]);
    const [searchTop, setSearchTop] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5001/api/users")
            .then((res) => {
                const allUsers = res.data.users || [];
                setUsers(allUsers);

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const recentUsers = allUsers.filter(user => {
                    if (!user.createdAt) return false;
                    const createdDate = new Date(user.createdAt);
                    return createdDate >= oneWeekAgo;
                });

                setNewUsers(recentUsers);
            })
            .catch((err) => {
                // 에러 처리: 회원정보를 불러올 수 없음
            });
    }, []);

    const filteredTopUsers = newUsers.filter((user) =>
        user.name?.toLowerCase().includes(searchTop.toLowerCase())
    );
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
                        <div className="profile-image"><img src="https://www.dongyang.ac.kr/sites/dmu/images/sub/char2-1.png" alt="Profile" /></div>
                        <div className="profile-info">
                            <p>MARS</p>
                            <span>Mars1234@gmail.com</span>
                        </div>
                    </div>
            </nav>

            <main className="main-content">
                <section className="Upper">
                    <section className="top">
                        <div className="card new-card">
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
                                    onChange={(e) => setSearchTop(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <table className="list-table">
                                <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th>아이디</th>
                                        <th>가입일</th>
                                        <th>검사횟수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="empty">회원이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        filteredTopUsers.map((user, idx) => (
                                            <tr key={idx}>
                                                <td>{user.name || "이름"}</td>
                                                <td>{user.email || "아이디"}</td>
                                                <td>
                                                    {user.createdAt
                                                        ? new Date(user.createdAt)
                                                            .toLocaleDateString("ko-KR", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                            })
                                                            .replace(/\. /g, ".")
                                                            .replace(/\.$/, "")
                                                        : "가입일"}
                                                </td>
                                                <td>{user.measurmentCount ?? 0}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </section>
            </main>
        </div >
    );
};

export default UserTotal;
