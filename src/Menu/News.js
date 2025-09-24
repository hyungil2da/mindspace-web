// src/pages/News.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import { loadNews, saveNews } from "./DashBoard_Utility";
import { newsUpdates } from "./newsinfo.js";

// 화면이 비지 않도록 하는 기본값
function flattenNewsUpdates(updates) {
  let id = 1;
  const flat = [];
  updates.forEach(group => {
    (group.items || []).forEach(it => {
      const date = (it.date || "").replace(/\./g, "-");
      const title = it.version && it.version.trim() ? it.version : (it.content || "").split("\n")[0];
      flat.push({ id: id++, date, title, content: it.content || "" });
    });
  });
  flat.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return flat;
}
function mergeSeedWithExisting(existing, seed) {
  if (!Array.isArray(existing) || existing.length === 0) return seed;
  const keyOf = (n) => `${n.date}__${n.title}`;
  const existingKeys = new Set(existing.map(keyOf));
  const missing = seed.filter((n) => !existingKeys.has(keyOf(n)));
  if (missing.length === 0) return existing;
  const merged = [...missing, ...existing].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return merged;
}

const getDefaultById = (id) => {
  const base = flattenNewsUpdates(newsUpdates);
  return base.find(n => n.id === id);
};

const News = () => {
  // 1) 초기 로드 시 안전 가드: 배열이 아니면 기본값 사용
  const [news, setNews] = useState(() => {
    const saved = loadNews?.() ?? [];
    const seed = flattenNewsUpdates(newsUpdates);
    return mergeSeedWithExisting(saved, seed);
  });
  useEffect(() => {
    // 상태가 배열일 때만 저장
    if (Array.isArray(news)) saveNews?.(news);
  }, [news]);

  // 2) 편집/추가/삭제/초기화에 필요한 상태
  const [openRow, setOpenRow] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 3) 편집 열기
  const handleEdit = (item) => {
    setOpenRow(item.id);
    setEditTitle(item.title ?? "");
    setEditContent(item.content ?? "");
  };

  // 4) 저장(제목/내용 유효성 검사 포함)
  const handleSave = (id) => {
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();
    if (!trimmedTitle || !trimmedContent) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: trimmedTitle, content: trimmedContent } : n))
    );
    setOpenRow(null);
    setEditTitle("");
    setEditContent("");
    alert("수정이 완료되었습니다.");
  };

  // 5) 초기화(기본 리스트 기준 복구)
  const handleReset = (id) => {
    const def = getDefaultById(id);
    const resetTitle = def ? def.title : "";
    const resetContent = def ? def.content : "";
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, title: resetTitle, content: resetContent } : n)));
    setEditTitle(resetTitle);
    setEditContent(resetContent);
    alert("초기화되었습니다.");
  };

  // 6) 삭제
  const handleDelete = (id) => {
    if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
      setNews((prev) => prev.filter((n) => n.id !== id));
      if (openRow === id) {
        setOpenRow(null);
        setEditTitle("");
        setEditContent("");
      }
      alert("삭제되었습니다.");
    }
  };
  const handleResetAll = () => {
    if (!window.confirm("모든 뉴스를 newsinfo 기준으로 초기화하시겠습니까?")) return;
      const seeded = flattenNewsUpdates(newsUpdates); 
      setNews(seeded);                
     setOpenRow(null);
      setEditTitle("");
      setEditContent("");
      saveNews?.(seeded);
      alert("전체 초기화가 완료되었습니다.");
    };

  // 7) 추가(빈 제목/내용으로 편집폼 열기)
  const handleAdd = () => {
    const nextId = Array.isArray(news) && news.length ? Math.max(...news.map((n) => n.id)) + 1 : 1;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const newItem = { id: nextId, date: today, title: "", content: "" };
    setNews((prev) => [...prev, newItem]);
    setOpenRow(nextId);
    setEditTitle("");
    setEditContent("");
  };

  // 8) 안전 가드: 배열이 아닐 경우에는 빈 배열로 렌더링
  const safeNews = Array.isArray(news) ? news : [];

  return (
    <div className="dashboard-container">
      {/* Notice.js와 동일한 사이드바 */}
      <nav className="sidebar">
        <div className="DashLogo">MINDSPACE</div>
        <ul>
          <li>
            <NavLink to="/DashBoard" className={({ isActive }) => (isActive ? "active" : "")}>
              대시보드
            </NavLink>
          </li>
          <li>
            <NavLink to="/User" className={({ isActive }) => (isActive ? "active" : "")}>
              사용자 관리
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              홈페이지
            </NavLink>
          </li>
        </ul>
        <div className="card profile-card">
          <div className="profile-image">사진</div>
          <div className="profile-info">
            <p>관리자</p>
            <span>아이디</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="noticebox">
          <div className="search">
            <div className="card-title">개발 소식</div>
          </div>
          <div className="flex justify-end mt-3 gap-2">
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleAdd}>
              뉴스 추가
            </button>
            <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={handleResetAll}>
              전체 초기화
            </button>
          </div>
          <table className="list-table border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">작성일</th>
                <th className="p-2">제목</th>
                <th className="p-2">편집</th>
              </tr>
            </thead>

            <tbody>
              {safeNews.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    등록된 뉴스가 없습니다.
                  </td>
                </tr>
              ) : (
                safeNews.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.title || "(제목 없음)"}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => (openRow === item.id ? setOpenRow(null) : handleEdit(item))}
                        >
                          {openRow === item.id ? "닫기" : "수정"}
                        </button>
                        <button className="px-3 py-1 bg-gray-500 text-white rounded ml-2" onClick={() => handleReset(item.id)}>
                          초기화
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded ml-2" onClick={() => handleDelete(item.id)}>
                          삭제
                        </button>
                      </td>
                    </tr>

                    {openRow === item.id && (
                      <tr>
                        <td colSpan={3} className="p-4 bg-gray-50">
                          <div className="mb-2">
                            <label className="block mb-1 text-sm font-medium">제목</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full border p-2 rounded"
                              placeholder="제목을 입력하세요"
                            />
                          </div>

                          <div className="mb-2">
                            <label className="block mb-1 text-sm font-medium">내용</label>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full h-24 border p-2 rounded"
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-2">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleSave(item.id)}>
                              저장
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default News;
