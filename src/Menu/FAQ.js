// 사용자 관리
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";

const FAQ = () => {
    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState([]);
    const [searchTop, setSearchTop] = useState("");
    const [searchBottom, setSearchBottom] = useState("");
    const [openRow, setOpenRow] = useState(null);
    const [editContent, setEditContent] = useState("");

    const [faqs, setFaqs] = useState([
        { id: 1, title: "왜 심리치료 게임을 개발하게 되었나요?", content: "코로나19 이후 증가한 스트레스, 우울, 불안 등의 심리 문제에 접근성과 지속성을 갖춘 새로운 솔루션이 필요했기 때문입니다." },
        { id: 2, title: "이 앱은 어떤 방식으로 감정을 측정하나요?", content: "설문조사(PSS, BDI-II, BAI), 안면 인식(Mediapipe, Tensorflow, OpenCV, CNN 모델), 뇌파 측정 기기를 통해 감정 데이터를 수집하고 분석합니다." },
        { id: 3, title: "감정 측정 결과는 어떻게 활용되나요?", content: "서버에서 종합 분석 후, 사용자 맞춤형 심리 솔루션을 제공하며, 필요시 VR 콘텐츠와 연계되어 보다 몰입감 잇는 심리치료 경험을 제공합니다." }
    ]);

    const handleEdit = (faq) => {
        setOpenRow(faq.id);
        setEditContent(faq.content);
    };

    const handleSave = (id) => {
        setFaqs((prev) =>
            prev.map((faq) =>
                faq.id === id ? { ...faq, content: editContent } : faq
            )
        );
        setOpenRow(null);
        setEditContent("");
    };

    useEffect(() => {
        axios.get("http://localhost:5001/api/users")
            .then((res) => {
                console.log("회원정보 불러오기 성공:", res.data);
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

    const filteredTopUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTop.toLowerCase())
    );

    const filteredBottomUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchBottom.toLowerCase())
    );

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
                    <li>
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
                    </li>
                </ul>
            </nav>

            {/* 메인 */}
            <main className="main-content">
                <section className="top-section">
                    <div className="user-top">
                        <div className="card">
                            <div className="search">
                                <div className="card-title">FAQ</div>
                            </div>

                            <table className="list-table border w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2">제목</th>
                                        <th className="p-2">답변</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs.map((faq) => (
                                        <React.Fragment key={faq.id}>
                                            <tr>
                                                <td className="p-2">{faq.title}</td>
                                                <td className="p-2">
                                                    <button
                                                        className="text-blue-600 underline"
                                                        onClick={() =>
                                                            openRow === faq.id ? setOpenRow(null) : handleEdit(faq)
                                                        }
                                                    >
                                                        {openRow === faq.id ? "닫기" : "수정"}
                                                    </button>
                                                </td>
                                            </tr>
                                            {openRow === faq.id && (
                                                <tr>
                                                    <td colSpan={2} className="p-2 bg-gray-50">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full border p-2 rounded"
                                                            rows={6} cols={80}
                                                        />
                                                        <div className="flex justify-end mt-2 gap-2">
                                                            <button
                                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                                                onClick={() => handleSave(faq.id)}
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
                        <div className="card profile-card">
                            <div className="profile-image">사진</div>
                            <div className="profile-info">
                                <p>관리자</p>
                                <span>아이디</span>
                            </div>
                            <div className="profile-actions">
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FAQ;
