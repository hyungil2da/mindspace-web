import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';

// YYYY-MM-DD (Asia/Seoul)
function ymdKst(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// 최근 7일 배열 생성 (과거→오늘)
function last7DaysKst() {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(ymdKst(d));
  }
  return days;
}

// 백엔드 rows 정규화 (count -> visitors 변환 및 날짜 공백 제거)
function normalizeDailyRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((item) => {
      if (item?.date) {
        const dateKey = item.date.trim(); 
        const countValue = Number(item?.count ?? 0);
        return { date: dateKey, visitors: isNaN(countValue) ? 0 : countValue };
      }
      return null;
    })
    .filter(Boolean);
}

// 누락 날짜 0 보정 + 날짜 오름차순 정렬
function fillMissingWithZero(rows) {
  if (rows.length === 0) {
    const want = last7DaysKst();
    return want.map((d) => ({ date: d, visitors: 0 }));
  }
  
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

const Visitor = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const timer = setTimeout(() => {
        if (mounted) setShouldRender(true);
    }, 100); 

    (async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.DAILY_COUNT);
        const rawData = Array.isArray(res?.data?.data) ? res.data.data : [];
        const normalized = normalizeDailyRows(rawData);
        const filled = fillMissingWithZero(normalized);
        
        if (mounted) {
          setData(filled);
        }
      } catch (err) {
        if (mounted) setError(err);
      }
    })();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []); 

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }
  
  if (!shouldRender) {
      return null; 
  }

  const maxCount = Math.max(0, ...data.map((d) => d.visitors));

  return (
    <div style={{ width: "100%", height: "auto", minHeight: "280px" }}> 
      <ResponsiveContainer width="100%" aspect={2.5}> 
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis
            allowDecimals={false}
            domain={[0, maxCount + (maxCount > 0 ? 1 : 0)]} 
            tickCount={maxCount + 2}
          />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="visitors" 
            stroke="#1D3162"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
          <Tooltip />
          <Legend payload={[{ value: '측정 횟수', type: 'line', color: '#1D3162' }]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visitor;
