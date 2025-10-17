import React, { useEffect, useState } from 'react';
import '../styles/ScrollToTop.css';
import '../styles/color.css';
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#A67B5B', // var(--brown)
    color: '#F8F5F2', // var(--bg-base)
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, background-color 0.2s',
  };

  const hoverStyle = {
    transform: 'scale(1.1)',
    backgroundColor: '#9A6A4E', // 약간 어두운 갈색
  };

  return (
    visible && (
      <button 
        onClick={scrollToTop} 
        style={buttonStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
      >
        ⬆
      </button>
    )
  );
}

export default ScrollToTop;