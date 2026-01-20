import React from "react";
import "../styles/SystemFlow.css";
import '../styles/color.css';
import survey from "../assets/survey.jpg";
import facial from "../assets/facial.jpg";
import brain from "../assets/brain.jpg";
import db from "../assets/db.jpg";
import phone from "../assets/phone.jpg";
import vr from "../assets/VR.jpg";

import fireicon from "../assets/fireicon.png";
import moleicon from "../assets/moleicon.png";
import fishingicon from "../assets/fishingicon.png";
import animalicon from "../assets/animalicon.png";

function SystemFlow() {
  return (
    <div className="system-flow-container">
      <h2>심리치료 시스템 구조도</h2>

      {/* 입력 카드 그룹 */}
      <div className="card-group light-gray">
        <div className="flow-card">
          <img src={survey} alt="설문조사" />
          <p>설문조사</p>
        </div>
        <div className="flow-card">
          <img src={facial} alt="안면인식" />
          <p>안면인식</p>
        </div>
        <div className="flow-card">
          <img src={brain} alt="뇌파측정" />
          <p>뇌파측정</p>
        </div>
      </div>

      {/* 서버/DB 위 화살표 */}
      <div className="arrow-wrapper">
        <div className="arrow" id="top-to-middle">⬇</div>
      </div>

      {/* 서버 → 앱 → VR */}
      <div className="card-group light-gray middle-flow">
        <div className="flow-card">
          <img src={db} alt="서버 / DB" />
          <p>서버 / DB</p>
        </div>
        <div className="arrow-horizontal">➡</div>
        <div className="flow-card">
          <img src={phone} alt="앱 결과 출력" />
          <p>감정 분석</p>
        </div>
        <div className="arrow-horizontal">➡</div>
        <div className="flow-card">
          <img src={vr} alt="VR 심리치료" />
          <p>VR 심리치료</p>
        </div>
      </div>

      {/* VR 아래 화살표 */}
      <div className="arrow-wrapper">
        <div className="arrow" id="middle-to-bottom">⬇</div>
      </div>

      {/* 게임 카드 그룹 */}
      <div className="card-group light-gray bottom-flow">
        <div className="flow-card">
          <img src={fireicon} alt="불멍" />
          <p>불멍</p>
        </div>
        <div className="flow-card">
          <img src={moleicon} alt="두더지" />
          <p>두더지</p>
        </div>
        <div className="flow-card">
          <img src={fishingicon} alt="낚시" />
          <p>낚시</p>
        </div>
        <div className="flow-card">
          <img src={animalicon} alt="동물" />
          <p>동물</p>
        </div>
      </div>
    </div>
  );
}

export default SystemFlow;
