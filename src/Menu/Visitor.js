import React from "react";
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

const TEMP_MEASUREMENT_COUNT_DATA = {
  message: "7일간의 일별 measurement 카운트 조회 성공",
  data: [
    {
      date: "2025-09-07",
      count: 2,
    },
    {
      date: "2025-09-08",
      count: 2,
    },
    {
      date: "2025-09-09",
      count: 0,
    },
    {
      date: "2025-09-10",
      count: 1,
    },
    {
      date: "2025-09-11",
      count: 1,
    },
    {
      date: "2025-09-12",
      count: 3,
    },
    {
      date: "2025-09-13",
      count: 2,
    },
  ],
  period: {
    startDate: "2025-09-06",
    endDate: "2025-09-14",
  },
};

const Visitor = () => {
  const data = TEMP_MEASUREMENT_COUNT_DATA.data.map((item) => ({
    date: item.date,
    visitors: item.count,
  }));

  return (
    <div style={{ width: "100%", height: "290" }}>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#1D3162"
          strokeWidth={2}
        />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default Visitor;



/*
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

// YYYY-MM-DD (Asia/Seoul)
function ymdKst(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// 최근 7일(금일 포함) 배열 생성: 오름차순(과거→오늘)
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

// 백엔드 rows 정규화: { date, count } 또는 { _id:{y,m,d}, count } → {date, visitors}
function normalizeDailyRows(rows) {
  if (!Array.isArray(rows)) return [];
  const toYmd = (item) => {
    if (item?.date) return item.date;
    if (item?._id) {
      const y = String(item._id.year);
      const m = String(item._id.month).padStart(2, "0");
      const d = String(item._id.day).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return undefined;
  };
  return rows
    .map((item) => {
      const date = toYmd(item);
      if (!date) return null;
      return { date, visitors: Number(item?.count ?? 0) };
    })
    .filter(Boolean);
}

// 누락 날짜 0 보정 + 날짜 오름차순 정렬
function fillMissingWithZero(rows) {
  const want = last7DaysKst(); // 7개
  const map = new Map(rows.map((r) => [r.date, r.visitors]));
  return want.map((d) => ({ date: d, visitors: map.get(d) ?? 0 }));
}

export default function Visitor() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/measurements/daily-count");
        // 1) 서버 페이로드 정규화
        const normalized = normalizeDailyRows(res?.data?.data);
        // 2) 최근 7일 축에 맞춰 0 채움
        const filled = fillMissingWithZero(normalized);
        if (mounted) {
          // 디버깅용 확인
          // console.log("Visitor normalized:", normalized);
          // console.log("Visitor filled:", filled);
          setData(filled);
        }
      } catch (err) {
        console.error("7일간 검사 데이터 불러오기 실패:", err);
        if (mounted) setError(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div style={{ width: "100%", height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis
            allowDecimals={false}   // 정수만
            domain={[0, "auto"]}    // 최소 0
            tickFormatter={(v) => v}
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
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
*/