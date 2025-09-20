import React from 'react';
import FaqItem from '../components/FaqItem';
import '../styles/FaqSection.css';

const faqData = [
  {
    question: "왜 심리치유 게임을 개발하게 되었나요?",
    answer:
      "코로나19 이후 증가한 스트레스, 우울, 불안 등의 심리문제에 접근성과 지속성을 갖춘 대안을 제시하기 위함입니다. 기존 심리치료는 비용, 사회적 편견, 불편한 접근성 등의 어려움이 있었습니다.",
  },
  {
    question: "이 앱은 어떤 방식으로 감정을 측정하나요?",
    answer:
      "설문조사(PSS, BDI-II, BAI), 안면 인식(mediapipe, Tensorflow, OpenCV, CNN 모델), 뇌파 측정 기기를 통해 감정 데이터를 수집하고 분석합니다.",
  },
  {
    question: "감정 측정 결과는 어떻게 활용되나요?",
    answer:
      "측정 결과는 서버에서 종합 분석 후, 결과를 안내해줍니다. 이를 통한 사용자 맞춤형 심리 치유 솔루션인 VR게임을 추천해주어 보다 몰입감 있는 심리치유 경험을 제공합니다.",
  },
  {
    question: "측정 가능한 감정 요소는 무엇인가요?",
    answer:
      "기본 감정(7가지)과 함께 우울/슬픔, 불안/공포, 스트레스, 분노 등의 심리 문제로 분류해 분석합니다.",
  },
  {
    question: "데이터는 어떻게 저장되고 보호되나요?",
    answer:
      "사용자의 닉네임, 측정 횟수, 마지막 기록, 설문 결과 등 모든 데이터는 서버에 안전하게 저장되며, 암호화 처리됩니다. 백엔드와 관리자 페이지에서만 접근 가능합니다.",
  },
  {
    question: "누가 이 앱을 사용하면 좋을까요?",
    answer:
      "심리적 불편함을 겪고 있는 누구나 사용할 수 있어요. 특히 학생, 직장인, 불안/우울 증상을 경험하는 분들께 추천합니다.",
  },
];


function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-title">자주 묻는 질문</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>

      {/* 추가 문의 버튼 
      <div className="faq-contact">
        <button
          className="faq-button"
          onClick={() => alert("준비 중이에요!")}
        >
          추가 문의하기
        </button>
      </div>*/}
      
    </section>
  );
}

export default FaqSection;