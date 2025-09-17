// 문의 상세 페이지
import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./DashBoard.css";

const Ask = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");

  const inquiries = [
    { id: "Ask1", date: "2025-08-27", content: "문의 내용 1", email: "aaa@gmail.com" },
    { id: "Ask2", date: "2025-08-26", content: "문의 내용 2", email: "bbb@gmail.com" },
  ];

  const inquiry = inquiries.find((item) => item.id === id);

  if (!inquiry) return <p>해당 문의를 찾을 수 없습니다.</p>;

  const handleSubmit = () => {
    alert(`답변 등록 완료!\n내용: ${answer}`);
    setAnswer("");
  };

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
        </ul>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="main-content">
        <section className="top-section">
          <div className="user-top">
            <div className="card">
              <div className="title">문의</div>

              <hr className="divider" />

              <div className="inquiry-header">
                <div className="ask-title">{'[ '}{inquiry.content}{' ]'}</div>
                <div className="send">보낸이 : {inquiry.email}</div>
                <div className="ask-date">{inquiry.date}</div>
              </div>

              {/* 문의 내용 */}
              <div className="inquiry-content">{inquiry.content}</div>

              <hr className="divider" />

              {/* 답변 영역 */}
              <div className="answer-section">
                <div className="profile-image">사진</div>
                <div className="answer-box">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="답변을 입력하세요"
                  />
                  <div className="button-wrapper">
                    <button onClick={handleSubmit}>등록</button>
                  </div>
                </div>
              </div>

            </div>
            <div className="card profile-card">
              <div className="profile-image">사진</div>
              <div className="profile-info">
                <p>관리자</p>
                <span>아이디</span>
              </div>
              <div className="profile-actions">
              </div>
            </div>
          </div>
          <div className="empty">

          </div>
        </section>
      </main>
    </div>
  );
};

export default Ask;
