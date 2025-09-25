import React from "react";
import { NavLink } from "react-router-dom";
import Count from "./Count";

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
        <section className="top">
          <div className="card userlist-card">
            <div className="card-title">사용자 별 검사 횟수 평균</div>
            <Count />
          </div>
        </section>

        <section className="top">
          <div className="card userlist-card">
            <div className="card-title">변화도</div>
            <div className="graph"></div>
          </div>
        </section>
      </main>
    </div >
  );
};

export default Statistics;
