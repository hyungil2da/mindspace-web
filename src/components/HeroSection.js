import { useState } from 'react';
import SurveyPopup from './SurveyPopup';
import '../styles/HeroSection.css';
import '../styles/color.css';
function HeroSection() {
  const [showPopup, setShowPopup] = useState(false);
  const [surveyScore, setSurveyScore] = useState(null);
  const [surveyLevel, setSurveyLevel] = useState('');

  const openPopup = () => setShowPopup(true);

  const closePopup = (result) => {
    setShowPopup(false);
    if (result && typeof result.score === 'number') {
      setSurveyScore(result.score);
      setSurveyLevel(result.level);
    }
  };

  const getButtonText = () => {
    if (surveyScore === null) return '체험해보기-불안 척도';
    return `설문 완료 - ${surveyLevel}`;
  };

  return (
    <section className="hero" id="test">
      <p className="subtitle">당신의 감정을 인식하는 맞춤형 심리치료 플랫폼</p>
      <h1 className="title">
        감정 분석과 설문을 한 번에,
        <br />지금, 나에게 딱 맞는 마음 케어를 시작하세요
      </h1>
      <p className="description">
        복잡한 심리상담은 그만!
        얼굴 인식, 뇌파 측정, 설문을 통해 당신의 감정을 정확히 파악하고
        VR 콘텐츠로 즐겁게 마음을 회복할 수 있어요 😊
      </p>
      <button className="hero-btn" onClick={openPopup}>
        {getButtonText()}
      </button>
      <p className="caption">
        {surveyScore === null
          ? '설치 없이 웹에서 체험 가능합니다!'
          : '버튼 클릭 시 다시 설문 가능합니다!'}
      </p>

      {showPopup && <SurveyPopup onClose={closePopup} />}
    </section>
  );
}

export default HeroSection;
