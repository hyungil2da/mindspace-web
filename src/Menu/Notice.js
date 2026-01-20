import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";
import { loadFaqs, loadNotices, saveFaqs, saveNotices } from "./DashBoard_Utility";

const Notice = () => {
    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState([]);
    const [searchTop, setSearchTop] = useState("");
    const [searchBottom, setSearchBottom] = useState("");

    const defaultNotices = [
        { id: 1, date: "2025-02-01", title: "공지1", content: "첫 번째 공지 내용입니다." },
        { id: 2, date: "2025-05-18", title: "공지2", content: "두 번째 공지 내용입니다." },
        { id: 3, date: "2025-09-23", title: "공지3", content: "세 번째 공지 내용입니다." }
    ];
    const [notices, setNotices] = useState(() => {
        const saved = loadNotices();
        return saved.length ? saved : defaultNotices;
    });
    useEffect(() => { saveNotices(notices); }, [notices]);

    useEffect(() => {saveNotices(notices);}, [notices]);

    const [openRow, setOpenRow] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");


    const handleEdit = (notice) => {
        setOpenRow(notice.id);
        setEditTitle(notice.title);
        setEditContent(notice.content);
    };

    const handleSave = (id) => {
        setNotices((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, title: editTitle, content: editContent } : n
            )
        );
        setOpenRow(null);
        setEditTitle("");
        setEditContent("");
        alert("수정이 완료되었습니다.");
    };

    useEffect(() => {
        axios.get("http://localhost:5001/api/users")
            .then((res) => {
                const allUsers = res.data.users || [];
                setUsers(allUsers);

                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const recentUsers = allUsers.filter(user => {
                    if (!user.createdAt) return false;
                    const createdDate = new Date(user.createdAt);
                    return createdDate >= oneWeekAgo;
                });

                setNewUsers(recentUsers);
            })
            .catch((err) => {
                console.error("회원정보 불러오기 실패:", err);
            });
    }, []);

    return (
        <div className="dashboard-container">
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
                          {/*<li>
                    <NavLink to="/Post" className={({ isActive }) => (isActive ? "active" : "")}>
                      게시판 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Statistics" className={({ isActive }) => (isActive ? "active" : "")}>
                      통계
                    </NavLink>
                    </li>
                    <li>
                    <NavLink to="/Setting" className={({ isActive }) => (isActive ? "active" : "")}>
                        설정
                    </NavLink>
                  </li>*/}
                  <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                       홈페이지
                    </NavLink>
                    </li>                    
                </ul>
                <div className="card profile-card">
                    <div className="profile-image"><img src="https://www.dongyang.ac.kr/sites/dmu/images/sub/char2-1.png" alt="Profile" /></div>
                    <div className="profile-info">
                        <p>관리자</p>
                        <span>아이디</span>
                    </div>
                    <div className="profile-actions">
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="noticebox">
                    <div className="search">
                        <div className="card-title">공지</div>
                    </div>

                    <table className="list-table border w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">작성일</th>
                                <th className="p-2">제목</th>
                                <th className="p-2">답변</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice) => (
                                <React.Fragment key={notice.id}>
                                    <tr>
                                        <td className="p-2">{notice.date}</td>
                                        <td className="p-2">{notice.title}</td>
                                        <td className="p-2">
                                            <button
                                                className="text-blue-600 underline"
                                                onClick={() =>
                                                    openRow === notice.id ? setOpenRow(null) : handleEdit(notice)
                                                }
                                            >
                                                {openRow === notice.id ? "닫기" : "수정"}
                                            </button>
                                        </td>
                                    </tr>
                                    {openRow === notice.id && (
                                        <tr>
                                            <td colSpan={3} className="p-4 bg-gray-50">
                                                <div className="mb-2">
                                                    <label className="block mb-1 text-sm font-medium">제목 </label>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            width: '350px',
                                                            height: '30px',
                                                        }}
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="w-full border p-2 rounded" />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="block mb-1 text-sm font-medium">내용 </label>
                                                    <textarea
                                                        style={{
                                                            marginTop: '5px',
                                                            width: '350px',
                                                            height: '30px',
                                                        }}
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        className="w-full h-24 border p-2 rounded"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                        onClick={() => handleSave(notice.id)}
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

export default Notice;
