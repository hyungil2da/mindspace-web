// 사용자 상세 페이지
import React from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";

const UserSetting = () => {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="DashLogo">MINDSPACE</div>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
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
          <div className="card">
            <div className="newUser">
              <h3>신규 회원 목록</h3>
              <table className="list-table">
                <thead>
                  <tr>
                    <th>가입일</th>
                    <th>이름</th>
                    <th>닉네임</th>
                    <th>아이디</th>
                    <th>검사 횟수</th>
                    <th>검사 정보</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 데이터 자리 */}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card profile-card">
            <div className="profile-image">사진</div>
            <div className="profile-info">
              <p>관리자</p>
              <span>아이디</span>
            </div>
            <div className="profile-actions">
              <button>사진</button>
            </div>
          </div>
        </section>

        <section className="bottom-section">
          <div className="card">
            <div className="newUser">
              <h3>사용자 목록</h3>
            </div>
            <table className="list-table">
              <thead>
                <tr>
                  <th>가입일</th>
                  <th>이름</th>
                  <th>닉네임</th>
                  <th>아이디</th>
                  <th>검사 횟수</th>
                  <th>검사 정보</th>
                </tr>
              </thead>
              <tbody>
                {/* 데이터 자리 */}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserSetting;
