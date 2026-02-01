// API Base URL 설정
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mindspace-1hpk.onrender.com';

// API 엔드포인트
export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/api/users`,
  RECENT_EMOTIONS: (userId) => `${API_BASE_URL}/api/users/recent-emotions/${userId}`,
  DAILY_COUNT: `${API_BASE_URL}/api/measurements/daily-count`,
};
