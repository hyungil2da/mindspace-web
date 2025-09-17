import React, { useEffect, useState } from "react";
import axios from "axios";
import Visitor from "./Visitor";
import FAQ from "./FAQ";
import Notice from "./Notice";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import DailySummary from "../Menu/DailySummary";
import logo from '../assets/EmotionVR.png';

const DashBoard = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/users")
      .then((res) => {
        const allUsers = res.data.users || [];

        // 오늘 날짜 기준 7일 전
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // 가입일이 일주일 이내인 회원
        const recentUsers = allUsers.filter(user => {
          if (!user.createdAt) return false;
          const createdDate = new Date(user.createdAt);
          return createdDate >= oneWeekAgo;
        });

        setNewUsers(recentUsers);
      })
      .catch((err) => {
        console.error("회원정보 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="DashLogo">
                  <button className="logo-btn">
  <img src={logo} alt="로고" className="logo-img" onClick={() => window.location.href = '../Main_page'}/>
</button>
          MINDSPACE</div>
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
        <section className="Upper">
          <section className="top">
            <div className="card dashboard-card">
              <div className="card-header">
                <div className="card-title">방문자 현황</div>
              </div>
              <Visitor />
            </div>

            <div className="card dashboard-card">
              <div className="card-header">
                <div className="card-title-summary">일자별 요약</div>
              </div>

              <div className="Daily">
                <DailySummary />
              </div>
            </div>
          </section>

          <div className="card profile-card">
            <div className="profile-image">사진</div>
            <div className="profile-info">
              <p>관리자</p>
              <span>아이디</span>
            </div>
          </div>
        </section>

        <section className="bottom">
          <div className="card dashboard-card ">
            <div className="card-header">
              <div className="card-title">FAQ</div>
              <NavLink to="/FAQ" className="plus-btn">자세히</NavLink>
            </div>

            <div className="faq-list">
              {[
                { id: 1, title: "왜 심리치료 게임을 개발하게 되었나요?", content: "코로나19 이후 증가한 스트레스, 우울, 불안 등의 심리 문제에 접근성과 지속성을 갖춘 새로운 솔루션이 필요했기 때문입니다." },
                { id: 2, title: "이 앱은 어떤 방식으로 감정을 측정하나요?", content: "설문조사(PSS, BDI-II, BAI), 안면 인식(Mediapipe, Tensorflow, OpenCV, CNN 모델), 뇌파 측정 기기를 통해 감정 데이터를 수집하고 분석합니다." },
                { id: 3, title: "감정 측정 결과는 어떻게 활용되나요?", content: "서버에서 종합 분석 후, 사용자 맞춤형 심리 솔루션을 제공하며, 필요시 VR 콘텐츠와 연계되어 보다 몰입감 잇는 심리치료 경험을 제공합니다." }
              ].map((faq) => (
                <div key={faq.id} className="faqItem">
                  <p className="faq-question">{faq.title}</p>
                  <span className="faq-answer">{faq.content}</span>
                  <hr />
                </div>
              ))}
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-header">
              <div className="card-title">공지</div>
              <NavLink to="/Notice" className="plus-btn">자세히</NavLink>
            </div>

            <div className="notice-list">
              {[
                { id: 1, title: "공지 제목1", content: "내용1", isNew: true },
                { id: 2, title: "공지 제목2", content: "내용2", isNew: false },
                { id: 3, title: "공지 제목3", content: "내용3", isNew: false }
              ].map((notice) => (
                <div key={notice.id} className="notice-item">
                  <p className="notice-title">
                    {notice.isNew && <span className="new-label">[NEW] </span>}
                    {notice.title}
                  </p>
                  <span className="notice-content">{notice.content}</span>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashBoard;
