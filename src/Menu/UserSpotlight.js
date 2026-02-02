import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./DashBoard.css";
import { API_ENDPOINTS } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

const apiBase = "https://mindspace-1hpk.onrender.com";

function buildGrid(measurements = []) {
  const rows = [...measurements]
    .slice(-10)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const header = ["날짜/시간", "우울", "불안", "스트레스", "분노", "안정"];

  const body = rows.map(m => {
    const raw = [
      Number(m.depression ?? 0),
      Number(m.anxiety ?? 0),
      Number(m.stress ?? 0),
      Number(m.anger ?? 0),
      Number(m.stability ?? 0),
    ];
    const allZero = raw.every(v => v === 0);
    const emotions = raw.map(v => v.toFixed(2));

    let majorIdx = null;
    let minorIdx = null;
    if (!allZero) {
      const sorted = raw.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
      majorIdx = sorted[0]?.i ?? null;
      minorIdx = sorted[1]?.i ?? null;
    }

    const ts = (() => {
      try {
        return new Date(m.timestamp).toLocaleString("ko-KR", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).replace(/\. /g, ".").replace(/\.$/, "");
      } catch { return m.timestamp; }
    })();

    return { ts, emotions, allZero, majorIdx, minorIdx };
  });

  return { header, body };
}

function normalizeRecentEmotions(apiData) {
  const list = Array.isArray(apiData?.emotionResults) ? apiData.emotionResults : [];
  const parseTs = (d, t) => new Date(`${d || "1970-01-01"}T${t || "00:00:00"}`).getTime();
  const sorted = [...list].sort((a, b) => parseTs(b.date, b.time) - parseTs(a.date, a.time)).slice(0, 10);
  return sorted.map(item => {
    const e = item.emotions || {};
    return {
      timestamp: `${item.date}T${item.time || "00:00:00"}`,
      depression: Number.isFinite(e.depression) ? e.depression : 0,
      anxiety: Number.isFinite(e.anxiety) ? e.anxiety : 0,
      stress: Number.isFinite(e.stress) ? e.stress : 0,
      anger: Number.isFinite(e.anger) ? e.anger : 0,
      stability: Number.isFinite(e.stability) ? e.stability : 0,
    };
  });
}

const DEFAULT_BASE_EMAIL = "mars@mars.com"; // 기본 테스트 유저 이메일 - MARS

const UserSpotlight = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(""); // userId는 _id 값
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    axios.get(API_ENDPOINTS.USERS)
      .then(res => {
        const userList = res.data.users || [];
        setUsers(userList);

        // 최초 로딩 시 test04@test.com의 _id를 찾아서 기본 선택
        if (userList.length && !userId) {
          const baseUser = userList.find(u => u.email === DEFAULT_BASE_EMAIL);
          if (baseUser) setUserId(baseUser._id);
        }
      })
      .catch(() => {
        // 에러 처리: 유저 목록을 불러올 수 없음
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(API_ENDPOINTS.RECENT_EMOTIONS(userId))
      .then(res => setMeasurements(normalizeRecentEmotions(res.data)))
      .catch(err => {
        // 에러 처리: 감정 기록을 불러올 수 없음
        setMeasurements([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const filteredUsers = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return users;
    return users.filter(u =>
      (u.name || "").toLowerCase().includes(k) ||
      (u.email || "").toLowerCase().includes(k) ||
      (u._id || "").toLowerCase().includes(k)
    );
  }, [users, keyword]);

  const grid = buildGrid(measurements);

  return (
    <div className="dashboard-card5">
      <div className="spotlight-controls">
        <input
          className="search-input"
          placeholder="이름 또는 이메일을 검색해 주세요"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <select
          className="spotlight-select"
          value={userId}
          onChange={e => setUserId(e.target.value)}
        >
          <option value="">유저를 선택해 주세요</option>
          {filteredUsers.map(u => (
            <option key={u._id} value={u._id}>
              {u.name || "(이름)"} / {u.email || "(아이디)"} / {u._id}
            </option>
          ))}
        </select>
      </div>

      <div className="measurement-panel" style={{marginLeft: "70px"}}>
        {loading ? (
          <div className="empty">불러오는 중...</div>
        ) : (
          <table className="measurement-table">
            <thead>
              <tr>
                {grid.header.map(h => <th key={h} className="measurement-colhdr">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.body.length === 0 ? (
                <tr>
                  <td className="empty" colSpan={grid.header.length}>기록이 없습니다.</td>
                </tr>
              ) : grid.body.map((row, i) => (
                <tr key={i}>
                  <td className="measurement-cell">{row.ts}</td>
                  {row.allZero ? (
                    <td className="measurement-cell" colSpan={5}>감정 결과가 출력 되지 않았습니다.</td>
                  ) : row.emotions.map((v, j) => {
                    let cls = "measurement-cell";
                    if (j === row.majorIdx) cls += " major-cell";
                    else if (j === row.minorIdx) cls += " minor-cell";
                    return <td key={j} className={cls}>{v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserSpotlight;
