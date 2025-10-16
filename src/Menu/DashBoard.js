import React, { useEffect, useState } from "react";
import axios from "axios";
import Visitor from "./Visitor";
import FAQ from "./FAQ";
import Notice from "./Notice";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import DailySummary from "../Menu/DailySummary";
import mindspaceImage from './dmu.jpg';
import { loadFaqs, loadNotices, loadNews, saveNews } from "./DashBoard_Utility";
import { newsUpdates } from "./newsinfo.js";
import UserSpotlight from "./UserSpotlight";

function flattenNewsUpdates(updates) {
  let id = 1;
  const flat = [];
  updates.forEach(group => {
    (group.items || []).forEach(it => {
      const date = (it.date || "").replace(/\./g, "-");
      const title = it.version && it.version.trim() ? it.version : (it.content || "").split("\n")[0];
      flat.push({
        id: id++,
        date,
        title,
        content: it.content || ""
      });
    });
  });
  flat.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return flat;
}

function mergeSeedWithExisting(existing, seed) {
  if (!Array.isArray(existing) || existing.length === 0) return seed;
  const keyOf = (n) => `${n.date}__${n.title}`;
  const existingKeys = new Set(existing.map(keyOf));
  const missing = seed.filter((n) => !existingKeys.has(keyOf(n)));
  if (missing.length === 0) return existing;
  const merged = [...missing, ...existing].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return merged;
}

const DashBoard = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [faqData, setFaqData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    setFaqData(loadFaqs());
    setNoticeData(loadNotices());
    const existingNews = loadNews();
    const seed = flattenNewsUpdates(newsUpdates);
    const merged = mergeSeedWithExisting(existingNews, seed);
    setNewsData(merged);
    if (JSON.stringify(existingNews || []) !== JSON.stringify(merged)) {
      saveNews(merged);
    }

    const onStorage = (e) => {
      if (e.key === "faqData") setFaqData(loadFaqs());
      if (e.key === "noticeData") setNoticeData(loadNotices());
      if (e.key === "newsData") setNewsData(loadNews());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5001/api/users")
      .then((res) => {
        const allUsers = res.data.users || [];
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
        console.error("회원정보 불러오기 실패:", err);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="DashLogo">
          MINDSPACE
        </div>
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
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              홈페이지
            </NavLink>
          </li>
        </ul>

        <div className="card profile-card">
          <div className="profile-image">
            <img src={mindspaceImage} alt="Profile" />
          </div>
          <div className="profile-info">
            <p>MARS</p>
            <span>Mars1234@gmail.com</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <section className="top1">
          <div className="card dashboard-card1">
            <div className="card-header">
              <div className="card-title">방문자 현황</div>
            </div>
            <Visitor />
          </div>

          <div className="card dashboard-card2">
            <div className="card-header">
              <div className="card-title-summary">오늘의 검사 수치</div>
            </div>

            <div className="Daily">
              <DailySummary />
            </div>
          </div>
        </section>

        <section className="top2">
          <div className="card dashboard-card3">
            <div className="card-header">
              <div className="card-title">검사 기록</div>
            </div>
            <UserSpotlight users={newUsers} />
          </div>

          {/* ✅ FAQ 카드 (줄바꿈/들여쓰기 유지) */}
          <div className="card dashboard-card3">
            <div className="card-header">
              <div className="card-title">FAQ</div>
              <NavLink to="/FAQ" className="plus-btn">자세히</NavLink>
            </div>

            <div
              className="faq-list"
              style={{
                maxHeight: "300px",   // 고정 높이
                overflowY: "auto",     // 스크롤 활성화
                paddingRight: "8px",
              }}
            >
              {(faqData.length ? faqData : [
                { id: 1, title: "왜 심리치유 게임을 개발하게 되었나요?", content: "코로나19 이후 증가한 스트레스, 우울, 불안 등의 심리문제에 접근성과 지속성을 갖춘 대안을 제시하기 위함입니다. 기존 심리치료는 비용, 사회적 편견, 불편한 접근성 등의 어려움이 있었습니다." },
                { id: 2, title: "이 앱은 어떤 방식으로 감정을 측정하나요?", content: "설문조사(PSS, BDI-II, BAI), 안면 인식(mediapipe, Tensorflow, OpenCV, CNN 모델), 뇌파 측정 기기를 통해 감정 데이터를 수집하고 분석합니다." },
                { id: 3, title: "감정 측정 결과는 어떻게 활용되나요?", content: "측정 결과는 서버에서 종합 분석 후, 결과를 안내해줍니다. 이를 통한 사용자 맞춤형 심리 치유 솔루션인 VR게임을 추천해주어 보다 몰입감 있는 심리치유 경험을 제공합니다." },
                { id: 4, title: "측정 가능한 감정 요소는 무엇인가요?", content: "기본 감정(7가지)과 함께 우울/슬픔, 불안/공포, 스트레스, 분노 등의 심리 문제로 분류해 분석합니다." },
                { id: 5, title: "데이터는 어떻게 저장되고 보호되나요?", content: "사용자의 닉네임, 측정 횟수, 마지막 기록, 설문 결과 등 모든 데이터는 서버에 안전하게 저장되며, 암호화 처리됩니다. 백엔드와 관리자 페이지에서만 접근 가능합니다." },
                { id: 6, title: "누가 이 앱을 사용하면 좋을까요?", content: "심리적 불편함을 겪고 있는 누구나 사용할 수 있어요. 특히 학생, 직장인, 불안/우울 증상을 경험하는 분들께 추천합니다." }
              ]).slice(0, faqData.length).map((faq) => (
                <div key={faq.id} className="faqItem">
                  <p className="faq-question">{faq.title}</p>
                  <span
                    className="faq-answer"
                    style={{ whiteSpace: "pre-wrap" }} // ✅ 줄바꿈/들여쓰기 유지
                  >
                    {faq.content}
                  </span>
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
