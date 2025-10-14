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

// 백엔드 rows 정규화
function normalizeDailyRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((item) => {
      // 서버 응답의 'count' 필드를 읽어 'visitors'로 변환
      if (item?.date) {
        const countValue = Number(item?.count ?? 0);
        return { date: item.date, visitors: isNaN(countValue) ? 0 : countValue };
      }
      return null;
    })
    .filter(Boolean);
}

// 누락 날짜 0 보정 + 날짜 오름차순 정렬
function fillMissingWithZero(rows) {
  const want = last7DaysKst();
  const map = new Map(rows.map((r) => [r.date, r.visitors]));
  return want.map((d) => ({ date: d, visitors: map.get(d) ?? 0 }));
}

const Visitor = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 필요하면 환경변수로 교체하세요.
        const API_URL =
          process.env.REACT_APP_API_URL ||
          "https://mindspace-1hpk.onrender.com/api/measurements/daily-count";

        console.log(`API 호출 시도: ${API_URL}`);
        const res = await axios.get(API_URL);

        console.log("API 응답:", res.data);

        // --- 응답 안전하게 처리 ---
        // 1) 일반적으로는 res.data.data가 배열이어야 함
        // 2) 혹시 res.data 자체가 배열이면 그것을 사용
        // 3) 다른 구조(ex: emotionAnalysis)가 온다면 빈 배열로 폴백하고 콘솔에 경고
        let rawData = [];

        if (Array.isArray(res?.data?.data)) {
          rawData = res.data.data;
        } else if (Array.isArray(res?.data)) {
          rawData = res.data;
        } else if (res?.data?.emotionAnalysis) {
          // 예시로 주신 payload가 emotionAnalysis라면 날짜 기반 daily-count가 아닌 다른 응답임.
          // 여기서는 안전하게 빈 배열로 처리하고 로그에 안내를 남김.
          console.warn(
            "API가 daily-count 형식(배열)을 반환하지 않았습니다. 받은 응답:",
            res.data
          );
          rawData = [];
        } else {
          console.warn("예상치 못한 API 응답 구조:", res?.data);
          rawData = [];
        }

        // 1) 데이터 정규화 및 visitors 키 설정 (count 사용)
        const normalized = normalizeDailyRows(rawData);

        // 2) 최근 7일 축에 맞춰 0 채움
        const filled = fillMissingWithZero(normalized);

        if (mounted) {
          console.log("최종 차트 데이터:", filled); // 디버깅용 로그
          setData(filled);
        }
      } catch (err) {
        console.error("7일간 측정 데이터 불러오기 실패:", err);
        if (mounted) setError(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다. (콘솔 로그 확인)</div>;
  }

  // 데이터 로딩 중일 때도 maxCount를 계산 (최소 0 보장)
  const maxCount = Math.max(0, ...data.map((d) => d.visitors));

  return (
    // height를 숫자로 설정하여 ResponsiveContainer가 정확히 작동하도록 함
    <div style={{ width: "100%", height: 290 }}>
      <ResponsiveContainer width="100%" height="100%">
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
            isAnimationActive={false} // 렌더링 오류 방지
          />
          <Tooltip />
          <Legend payload={[{ value: "측정 횟수", type: "line", color: "#1D3162" }]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visitor;
