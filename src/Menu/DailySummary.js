import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./DailySummary.css";

// 오늘 YYYY-MM-DD
const getTodayKstYmd = () => "2025-10-23";

//   new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Seoul",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).format(new Date());

const emotionKeys = ["depression", "anxiety", "stress", "anger", "stability"];

const emotionNameMap = {
  depression: "우울",
  anxiety: "불안",
  stress: "스트레스",
  anger: "분노",
  stability: "안정",
};


// 감정별 색
const emotionColors = {
  depression: "#00a7e3",
  anxiety: "#fb9d44",
  stress: "#ffd400",
  anger: "#930000",
  stability: "#5cab40",
};

// 모두 0이면 null, 아니면 major 키 반환
function majorKeyFromEmotions(e = {}) {
  const vals = emotionKeys.map((k) => Number(e[k] ?? 0));
  if (vals.every((v) => v === 0)) return null;
  const maxIdx = vals.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)[0].i;
  return vals[maxIdx] > 0 ? emotionKeys[maxIdx] : null;
}

// 더미 데이터(현재 하드코딩 배열과 동일 구조 유지: name/uv/fill)
function buildDummyPieData() {
  return [
    { name: emotionNameMap.depression, uv: 31, fill: emotionColors.depression },
    { name: emotionNameMap.anxiety, uv: 26, fill: emotionColors.anxiety }, 
    { name: emotionNameMap.stress, uv: 15, fill: emotionColors.stress },
    { name: emotionNameMap.anger, uv: 8, fill: emotionColors.anger },
    { name: emotionNameMap.stability, uv: 8, fill: emotionColors.stability },
  ];
}


const DailySummary = () => {
  const useDummy = false; // 더미모드로 교체하고 싶으면 true로
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchSummaryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) 전체 유저
      const usersRes = await axios.get("http://localhost:5001/api/users");
      const users = Array.isArray(usersRes?.data?.users) ? usersRes.data.users : [];
      const today = getTodayKstYmd();
      

      // 2) 유저별 최근 감정 병렬 조회
      const reqs = users.map((u) =>
        axios
          .get(`http://localhost:5001/api/users/recent-emotions/${u._id}`)
          .then((res) => res.data)
          .catch(() => null)
      );
      const payloads = await Promise.all(reqs);
      

      // 3) 오늘 항목만 대상으로 major 감정 카운트
      const counts = { depression: 0, anxiety: 0, stress: 0, anger: 0, stability: 0 };
      payloads.forEach((data) => {
        const list = Array.isArray(data?.emotionResults) ? data.emotionResults : [];
        
        list.forEach((item) => {
          if (item?.date !== today) return; // 오늘만
          const major = majorKeyFromEmotions(item?.emotions || {});
          if (major) counts[major] ++;    // all-zero는 제외
        });
      });


      // 4) 원그래프용 배열(name/uv/fill)로 변환
      const chartRows = emotionKeys.map((k) => ({
        name: emotionNameMap[k],
        uv: counts[k],
        fill: emotionColors[k],
      }));
      
      setPieData(chartRows);
    } catch (err) {
      console.error("❌ 에러:", err);
      setError(err);
      setPieData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useDummy) {
      setPieData(buildDummyPieData());
      setLoading(false);
    } else {
      fetchSummaryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
        <div className="chart-labels">데이터를 불러오는 중 오류가 발생했습니다.</div>
      ) : (!useDummy && pieData.every(d => (d?.uv ?? 0) === 0)) ? (
        <div className="chart-labels">오늘의 첫 감정 검사를 시작해보세요!</div>
      ) : (
        <PieChart
          accessibilityLayer
          width={400}
          height={250}
          margin={{
            bottom: 5,
            left: 5,
            right: 5,
            top: 5
          }}
          syncMethod="index"
        >
          <Pie
            activeShape={{
              fill: '#444444',
            }}
            data={pieData}
            dataKey="uv"
            outerRadius={80}
            nameKey="name"
          >{pieData.map((entry, idx) => (
            <Cell key={idx} fill={entry.fill} />
          ))}
          </Pie>
          <Tooltip defaultIndex={3} />
          <Legend
            align="right"
            layout="vertical"
            verticalAlign="middle"
          />
        </PieChart>)}
      <div className="chart-labels"><p>Emotion Chart</p></div>
    </div>
  );
};

export default DailySummary;