// src/components/SurveyPopup.jsx
import React, { useState } from 'react';
import questions from '../data/questions';
import '../styles/SurveyPopup.css';
import '../styles/color.css';
function SurveyPopup({ onClose }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleSelect = (score) => {
    const newAnswers = [...answers];
    newAnswers[current] = score;
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const baiScore = questions
    .map((q, i) => (q.type === 'BAI' ? answers[i] || 0 : 0))
    .reduce((a, b) => a + b, 0);

  const getBaiLevel = () => {
    const maxScore = questions.filter(q => q.type === 'BAI').length * 3;
    if (baiScore <= maxScore * 0.25) return '정상 😊';
    if (baiScore <= maxScore * 0.5) return '경미한 불안 🙂';
    if (baiScore <= maxScore * 0.75) return '중간 수준 불안 😐';
    return '심한 불안 😟';
  };

  const progress = Math.round((current / questions.length) * 100);
  const isComplete = current >= questions.length - 1 && answers.length === questions.length;

  const handleFinish = () => {
    if (typeof onClose === 'function') {
      onClose({ score: baiScore, level: getBaiLevel() });
    }
  };

  const getOptionsByType = (type) => {
    switch (type) {
      case 'BAI':
        return ['전혀 아님', '가끔 있음', '보통','자주 있음', '거의 항상'];
      case 'BDI':
        return ['전혀 그렇지 않다', '약간 그렇다','보통', '자주 그렇다', '항상 그렇다'];
      case 'PSS':
        return ['전혀 없음', '가끔 있음', '보통','자주 있음', '매우 자주 있음'];
      default:
        return ['0', '1','2', '3', '4'];
    }
  };

  const currentQuestion = questions[current];
  const options = getOptionsByType(currentQuestion.type);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={() => onClose(null)}>X</button>
        <h2>간단한 감정 설문</h2>

        <p className="progress-text">진행률: {isComplete ? 100 : progress}%</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${isComplete ? 100 : progress}%` }} />
        </div>

        {!isComplete ? (
          <>
            <p className="question">
              {currentQuestion.number}. {currentQuestion.text}
            </p>
            <div className="options">
              {options.map((label, idx) => (
                <button key={idx} onClick={() => handleSelect(idx)}>
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="question">설문이 완료되었습니다!</p>
            <p className="result-score">
              불안 척도 결과: <strong>{getBaiLevel()}</strong>
            </p>
            <button className="finish-btn" onClick={handleFinish}>확인</button>
          </>
        )}
      </div>
    </div>
  );
}

export default SurveyPopup;
