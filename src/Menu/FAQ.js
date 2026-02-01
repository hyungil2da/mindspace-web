// 사용자 관리
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./DashBoard.css";
import axios from "axios";
import { loadFaqs,  saveFaqs } from "./DashBoard_Utility";
import { API_ENDPOINTS } from '../config/api';

const defaultFaqs = [
  // =================================================================
  // **카테고리 1: 시스템 개요 및 목적 (WHAT & WHY)**
  // =================================================================
  { id: 1, title: "이 시스템의 핵심 기능과 작동 방식은 무엇인가요?", content: "A. 이 시스템은 **AI 기반 솔루션**으로, 카메라를 통해 **비접촉식**으로 얼굴 표정을 분석하여 **7가지 감정**을 **실시간**으로 측정합니다. 주요 기능은 **얼굴 감지, AI 감정 분석, 감정 분류**입니다." }, // (舊 id: 5)
  { id: 2, title: "측정 가능한 감정 요소는 무엇인가요?", content: "**기본 감정 7가지 (분노, 혐오, 두려움, 행복, 슬픔, 놀람, 무표정)**와 함께 우울/슬픔, 불안/공포, 스트레스, 분노 등의 심리 문제로 분류해 분석합니다." }, // (舊 id: 3)
  { id: 3, title: "이 앱은 어떤 방식으로 감정을 측정하나요?", content: "설문조사(PSS, BDI-II, BAI), **안면 인식(mediapipe, Tensorflow, OpenCV, CNN 딥러닝 모델)**, 뇌파 측정 기기를 통해 감정 데이터를 수집하고 분석합니다. 특히 안면 인식은 **비접촉식**이며 **비디오 영상**을 활용합니다." }, // (舊 id: 2)
  { id: 4, title: "왜 심리치유 게임을 개발하게 되었나요?", content: "코로나19 이후 증가한 스트레스, 우울, 불안 등의 심리문제에 접근성과 지속성을 갖춘 대안을 제시하기 위함입니다. 기존 심리치료는 비용, 사회적 편견, 불편한 접근성 등의 어려움이 있었습니다." }, // (舊 id: 1)

  // =================================================================
  // **카테고리 2: 기술 원리 및 감정 분석 프로세스 (HOW)**
  // =================================================================
  { id: 5, title: "감정은 어떤 과정을 거쳐 분석되나요? (3단계 프로세스)", content: "A. 먼저 **Haar Cascade 알고리즘**으로 얼굴 영역을 실시간 감지(1단계)합니다. 이후 **CNN 딥러닝 모델**이 얼굴 표정을 **48x48 픽셀** 크기로 표준화하여 분석(2단계)하며, 최종적으로 7가지 감정 수치를 **0~1 사이의 확률**로 실시간 분류(3단계)합니다." }, // (舊 id: 4)
  { id: 6, title: "감정 측정 과정이 관람객에게 어떻게 설명되나요? (전시용)", content: "관람객은 먼저 카메라 앞에 서게 되고(얼굴 감지), 시스템이 자동으로 **Haar Cascade 알고리즘**을 통해 얼굴을 감지합니다. 이후 **AI 감정 분석**이 시작되어 **실시간으로 7가지 감정 수치**의 변화가 화면에 표시됩니다. 최종적으로 어떤 감정이 가장 높게 나왔는지와 그 의미를 설명해 드립니다." }, // (舊 id: 10)
  
  // =================================================================
  // **카테고리 3: 결과 활용 및 시스템 강점 (ADVANTAGE)**
  // =================================================================
  { id: 7, title: "시스템의 기술적 혁신성과 주요 강점은 무엇인가요?", content: "이 시스템은 **딥러닝 기반**으로 **높은 정확도**를 보장하며, **비접촉식 카메라**를 통해 **실시간**으로 **다중 감정 상태**를 즉시 파악하는 혁신성을 가집니다. 사용자에게 복합적인 감정 상태를 **즉시** 보여주는 것이 핵심입니다." }, // (舊 id: 11)
  { id: 8, title: "이 시스템이 제공하는 주요 특징과 이점은 무엇인가요?", content: "A. **실시간 처리**로 즉시 결과 확인이 가능하고, **딥러닝 기반**의 **높은 정확도**로 **다중 감정 분석**이 가능합니다. 사용자에게는 감정 변화를 즉시 보여주는 혁신적인 경험을 제공합니다." }, // (舊 id: 6)
  { id: 9, title: "감정 측정 결과는 어떻게 활용되나요?", content: "측정 결과는 서버에서 종합 분석 후, 결과를 안내해줍니다. 이를 통한 사용자 맞춤형 심리 치유 솔루션인 VR게임을 추천해주어 보다 몰입감 있는 심리치유 경험을 제공합니다." }, // (舊 id: 7)

  // =================================================================
  // **카테고리 4: 이용 안내 및 보안 (USER GUIDE)**
  // =================================================================
  { id: 10, title: "누가 이 앱을 사용하면 좋을까요?", content: "심리적 불편함을 겪고 있는 누구나 사용할 수 있어요. 특히 학생, 직장인, 불안/우울 증상을 경험하는 분들께 추천합니다." }, // (舊 id: 8)
  { id: 11, title: "데이터는 어떻게 저장되고 보호되나요?", content: "사용자의 닉네임, 측정 횟수, 마지막 기록, 설문 결과 등 모든 데이터는 서버에 안전하게 저장되며, 암호화 처리됩니다. 백엔드와 관리자 페이지에서만 접근 가능합니다." } // (舊 id: 9)
];
 
const FAQ = () => {
    const [users, setUsers] = useState([]);
    const [editTitle, setEditTitle] = useState("");
    const [openRow, setOpenRow] = useState(null);
    const [editContent, setEditContent] = useState("");

    // localStorage에서 데이터를 로드하거나 없으면 defaultFaqs 사용
    const [faqs, setFaqs] = useState(() => {
        try {
            const saved = loadFaqs();
            if (saved && saved.length > 0) {
                return saved;
            }
            // 저장된 데이터가 없으면 초기 데이터 저장 후 반환
            saveFaqs(defaultFaqs);
            return defaultFaqs;
        } catch (error) {
            return defaultFaqs;
        }
    });

    // faqs 변경 시 자동 저장
    useEffect(() => {
        saveFaqs(faqs);
    }, [faqs]);

    const handleEdit = (faq) => {
    setOpenRow(faq.id);
    setEditTitle(faq.title ?? "");
    setEditContent(faq.content ?? "");
    };

    const handleSave = (id) => {
        setFaqs((prev) =>
            prev.map((faq) =>
            faq.id === id ? { ...faq, title: editTitle, content: editContent } : faq
            )
        );
        setOpenRow(null);
        setEditTitle("");
        setEditContent("");
        alert("수정이 완료되었습니다.");
    };

    const getDefaultById = (id) => defaultFaqs.find((f) => f.id === id);
    const handleReset = (id) => {
        const def = getDefaultById(id);
        const resetTitle = def ? def.title : "";
        const resetContent = def ? def.content : "";
        setFaqs((prev) =>
        prev.map((faq) =>
            faq.id === id ? { ...faq, title: resetTitle, content: resetContent } : faq
            )
        );
        setEditTitle(resetTitle);
        setEditContent(resetContent);
        alert("초기화되었습니다.");
    };

    const handleAdd = () => {
        const nextId = faqs.length ? Math.max(...faqs.map((f) => f.id)) + 1 : 1;
        const newItem = { id: nextId, title: "새 질문", content: "" };
        setFaqs((prev) => [...prev, newItem]);
        setOpenRow(nextId);
        setEditTitle(newItem.title);
        setEditContent(newItem.content);
    };

    const deleteFaq = (id) => {
        if (window.confirm("정말로 이 FAQ를 삭제하시겠습니까?")) {
            setFaqs((prev) => prev.filter((faq) => faq.id !== id));
            alert("삭제되었습니다.");
        }
    };

    useEffect(() => {
        axios.get(API_ENDPOINTS.USERS)
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
            .catch(() => {
                // 에러 처리: 사용자 정보를 불러올 수 없음
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
                        <p>MARS</p>
                        <span>Mars1234@gmail.com</span>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="faqtop">
                    <div className="search">
                        <div className="card-title">FAQ</div>
                    </div>
                    <div className="flex justify-end mt-3">
                        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleAdd} style={{backgroundColor: '#1D3162', color: 'white', border: 'none', borderRadius: '4px',width: '80px', height: '40px', cursor: 'pointer'}}>
                            FAQ 추가
                            
                        </button>
                    </div>
                    <table className="list-table border w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">제목</th>
                                <th className="p-2">편집</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((faq) => (
                                <React.Fragment key={faq.id}>
                                    <tr>
                                        <td className="p-2">{faq.title}</td>
                                        <td className="p-2">
                                            <button style={{backgroundColor: '#1D3162', color: 'white', border: 'none', borderRadius: '4px',width: '50px', height: '30px', cursor: 'pointer', fontSize: '12px', marginRight: '8px'}}
                                                className="text-blue-600 underline"
                                                onClick={() =>
                                                    openRow === faq.id ? setOpenRow(null) : handleEdit(faq) 
                                                }
                                            >
                                                {openRow === faq.id ? "닫기" : "수정"}
                                            </button>
                                            <button className="px-3 py-1 bg-gray-500 text-white rounded" onClick={() => handleReset(faq.id)} style={{backgroundColor: '#1D3162', color: 'white', border: 'none', borderRadius: '4px',width: '50px', height: '30px', cursor: 'pointer', fontSize: '12px', marginRight: '8px'}}>초기화</button>
                                            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => deleteFaq(faq.id)} style={{backgroundColor: '#1D3162', color: 'white', border: 'none', borderRadius: '4px',width: '50px', height: '30px', cursor: 'pointer', fontSize: '12px', marginRight: '8px'}}>삭제</button>
                                        </td>
                                    </tr>
                                    {openRow === faq.id && (
                                        <tr>
                                            <td colSpan={2} className="p-2 bg-gray-50">
                                                <textarea rows={2} cols={80} type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border p-2 rounded" placeholder="질문(제목)" style={{ margin: "8px", padding: "2px" }}/>
                                                <br/>
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full border p-2 rounded"
                                                    rows={9} cols={80}
                                                />
                                                <div className="flex justify-end mt-2 gap-2">
                                                    <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleSave(faq.id)}>저장</button>
                                                    
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

export default FAQ;
