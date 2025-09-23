import React, { useState } from 'react';
import logo from '../assets/EmotionVR.png';
import '../styles/Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <a className="logo" href="#">
        <img src={logo} alt="로고" />
        <span className="logo-text" data-short="MS">MindSpace</span>
      </a>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <a href="#test" className="link">체험하기</a>
        <a href="#video" className="link">시연영상</a>
        <a href="#feature" className="link">게임 소개</a>
        <a href="#faq" className="link">FAQ</a>
        <a href="#news" className="link">소식</a>
        {/*<button className="dashboard-btn" onClick={() => window.location.href = '/Dashboard'}>관리자</button> */}
        <a className="dashboard-btn" style={{color: 'black', fontSize: '16px', fontWeight:'500'}} href="/Dashboard">관리자</a>
      </nav>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
}

export default Header;
