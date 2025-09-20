import React from 'react'
import { NavLink } from "react-router-dom";

const Setting = () => {
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
          <li>
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
          </li>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              홈페이지
            </NavLink>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <section className="top-section">
          <div className="Setting-top">
            <div className="card">
              <div className="newUser">
                <div className="card-title">관리자 계정</div>
                <div className="Bar">

                </div>
              </div>
            </div>
            <div className="settingCard">
              <h3>관리자 목록</h3>
              <table className="list-table">
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>설정 / 삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, date: "2025-08-27", content: "문의 내용 1" },
                    { id: 2, date: "2025-08-26", content: "문의 내용 2" }
                  ].map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.content}</td>
                      <td>
                        <NavLink to={`/inquiry/${item.id}`} className="detail-link">
                          자세히
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>
    </div>
  )
};

export default Setting
