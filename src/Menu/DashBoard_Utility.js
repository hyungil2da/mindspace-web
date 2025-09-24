const FAQ_KEY = "faqData";
const NOTICE_KEY = "noticeData";

const safeGet = (key) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeSet = (key, value) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value || []));
  } catch {

  }
};

export const loadFaqs = () => safeGet(FAQ_KEY);
export const saveFaqs = (faqs) => safeSet(FAQ_KEY, faqs);

export const loadNotices = () => safeGet(NOTICE_KEY);
export const saveNotices = (notices) => safeSet(NOTICE_KEY, notices);