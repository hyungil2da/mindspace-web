// 통계
import React from "react";
import { NavLink } from "react-router-dom";
import Visitor from "./Visitor";

const Statistics = () => {
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
        </ul>
      </nav>

      <main className="main-content">
        <section className="top-section">
          <div className="user-top">
            <div className="card stat-card">
              <div className="card-title">방문자 통계</div>
              <Visitor />
            </div>

            <div className="card profile-card">
              <div className="profile-image">사진</div>
              <div className="profile-info">
                <p>관리자</p>
                <span>아이디</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bottom">
          <div className="card statb-card">
            <div className="card-title">검사 횟수</div>
            <div className="graph"></div>
          </div>

          <div className="card statb-card">
            <div className="settingCard2">
              <div className="card-title">변화도</div>
              <div className="graph"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Statistics;
