import React, { useRef, useState, useEffect } from 'react';
import '../styles/FaqSection.css';
import '../styles/color.css';
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  // toggle
  const toggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = open
        ? contentRef.current.scrollHeight + 'px'
        : '0px';
    }
  }, [open]);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <div className="faq-question" onClick={toggle}>
        {question}
        <span>{open ? '▲' : '▼'}</span>
      </div>
      <div className="faq-answer-wrapper" ref={contentRef}>
        <div className="faq-answer">{answer}</div>
      </div>
    </div>
  );
}

export default FaqItem;
