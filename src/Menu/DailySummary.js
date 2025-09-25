import React from "react";
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./DailySummary.css";

// 오늘 YYYY-MM-DD
const getTodayKstYmd = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// 감정 키 고정 순서
const emotionKeys = ["depression", "anxiety", "stress", "anger", "stability"];

// 감정별 색
const emotionColors = {
  depression: "#8884d8",
  anxiety: "#83a6ed",
  stress: "#8dd1e1",
  anger: "#82ca9d",
  stability: "#a4de6c",
};

// 모두 0이면 null, 아니면 major 키 반환
function majorKeyFromEmotions(e = {}) {
  const vals = emotionKeys.map((k) => Number(e[k] ?? 0));
  if (vals.every((v) => v === 0)) return null;
  const maxIdx = vals.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v)[0].i;
  return emotionKeys[maxIdx];
}

// 더미 데이터(현재 하드코딩 배열과 동일 구조 유지: name/uv/fill)
function buildDummyPieData() {
  return [
    { name: "depression", uv: 31, fill: emotionColors.depression },
    { name: "anxiety", uv: 26, fill: emotionColors.anxiety },
    { name: "stress", uv: 15, fill: emotionColors.stress },
    { name: "anger", uv: 8, fill: emotionColors.anger },
    { name: "stability", uv: 8, fill: emotionColors.stability },
  ];
}


const DailySummary = () => {
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]); // 원그래프에 바로 쓰일 데이터(name/uv/fill)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const useDummy = true; // 더미모드로 교체하고 싶으면 true로

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
          if (major) counts[major] += 1;    // all-zero는 제외
        });
      });

      // 4) 원그래프용 배열(name/uv/fill)로 변환
      const chartRows = emotionKeys.map((k) => ({
        name: k,
        uv: counts[k],
        fill: emotionColors[k],
      }));
      setPieData(chartRows);
    } catch (err) {
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
  }, []);

  return (
    <div className="chart-container">
      <PieChart
        accessibilityLayer
        data={pieData}
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
            fill: 'red'
          }}
          data={pieData}
          dataKey="uv"
          outerRadius={80}
          nameKey="name"
        >
        </Pie>
        <Tooltip defaultIndex={3} />
        <Legend
          align="right"
          layout="vertical"
          verticalAlign="middle"
        />
      </PieChart>
      <div className="chart-labels">
        <p>Emotion Chart</p>
      </div>
    </div>
  );
};

export default DailySummary;