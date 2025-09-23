import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";
import { loadNews, saveNews } from "./DashBoard_Utility";

const defaultNews = [
  { id: 1, date: "2025-07-20", title: "v0.5", content: "EmotionVR 0.5 베타버전 출시!" },
  { id: 2, date: "2025-07-10", title: "", content: "웹 기능 작업 및 UI 디자인 개선" },
  { id: 3, date: "2025-05-20", title: "", content: "감정 분석 기능 연동 및 테스트 완료" }
];

const News = () => {
  const [news, setNews] = useState(() => {
    const saved = loadNews();
    return saved.length ? saved : defaultNews;
  });
  useEffect(() => { saveNews(news); }, [news]);

  const [openRow, setOpenRow] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleEdit = (item) => {
    setOpenRow(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
  };

  const handleSave = (id) => {
    setNews((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title: editTitle, content: editContent } : n
      )
    );
    setOpenRow(null);
    setEditTitle("");
    setEditContent("");
    alert("수정이 완료되었습니다.");
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar"/>

      <main className="main-content">
        <div className="noticebox">
          <div className="search">
            <div className="card-title">개발 소식 관리</div>
          </div>

          <table className="list-table border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">작성일</th>
                <th className="p-2">버전</th>
                <th className="p-2">내용</th>
                <th className="p-2">편집</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">{item.content}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={() =>
                          openRow === item.id ? setOpenRow(null) : handleEdit(item)
                        }
                      >
                        {openRow === item.id ? "닫기" : "수정"}
                      </button>
                    </td>
                  </tr>
                  {openRow === item.id && (
                    <tr>
                      <td colSpan={4} className="p-4 bg-gray-50">
                        <div className="mb-2">
                          <label>버전 </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full border p-2 rounded"
                          />
                        </div>
                        <div className="mb-2">
                          <label>내용 </label>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-24 border p-2 rounded"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => handleSave(item.id)}
                          >
                            저장
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default News;