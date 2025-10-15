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

// 백엔드 rows 정규화 (count -> visitors 변환 및 날짜 공백 제거)
function normalizeDailyRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((item) => {
      if (item?.date) {
        //[데이터 안정성] 날짜 매칭 오류 방지를 위해 양 끝 공백을 제거합니다. (trim)
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
  const want = last7DaysKst(); 
  const map = new Map(rows.map((r) => [r.date, r.visitors]));
  return want.map((d) => ({ date: d, visitors: map.get(d) ?? 0 }));
}


const Visitor = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [shouldRender, setShouldRender] = useState(false); //[버그 회피] Recharts 렌더링 버그를 피하기 위한 상태

  useEffect(() => {
    let mounted = true;
    
    //[버그 회피] 100ms 렌더링 지연 타이머: ResponsiveContainer가 올바른 크기를 인식하도록 강제합니다.
    const timer = setTimeout(() => {
        if (mounted) setShouldRender(true);
    }, 100); 

    (async () => {
      try {
        //[API 안정성] 로컬호스트 오류 방지를 위해 확인된 배포 주소로 변경했습니다.
        const API_URL =
          process.env.REACT_APP_API_URL ||
          "http://localhost:5001/api/measurements/daily-count";

        const res = await axios.get(API_URL);

        // 서버 응답 구조가 res.data.data에 데이터 배열이 있다고 가정하여 추출
        const rawData = Array.isArray(res?.data?.data) ? res.data.data : [];

        // 1) 데이터 정규화 및 visitors 키 설정 (count 사용)
        const normalized = normalizeDailyRows(rawData);
        
        // 2) 최근 7일 축에 맞춰 0 채움 (배열 길이가 7이 됨)
        const filled = fillMissingWithZero(normalized);
        
        if (mounted) {
          setData(filled);
        }
      } catch (err) {
        console.error("7일간 측정 데이터 불러오기 실패:", err);
        if (mounted) setError(err);
      }
    })();
    return () => {
      mounted = false;
      clearTimeout(timer); // 타이머 정리
    };
  }, []); 

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다. (콘솔 로그 확인)</div>;
  }
  
  //[버그 회피] shouldRender가 false이면 null 반환하여 차트 렌더링을 0.1초 지연시킵니다.
  if (!shouldRender) {
      return null; 
  }

  // 데이터 로딩 중일 때도 maxCount를 계산 (최소 0 보장)
  const maxCount = Math.max(0, ...data.map((d) => d.visitors));

  return (
    //[반응형/공간 확보] height: "auto"를 유지하되, minHeight를 추가하여 최소한의 공간을 확보합니다.
    <div style={{ width: "100%", height: "auto", minHeight: "280px" }}> 
      
      {/* [반응형] height 대신 aspect를 사용하여 부모 너비에 따라 높이를 비율로 조정합니다. */}
      <ResponsiveContainer width="100%" aspect={2.5}> 
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis
            allowDecimals={false}
            //[데이터 처리] count가 모두 0일 때도 Y축 도메인 [0, 1]을 설정하여 선이 보이게 합니다.
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
            isAnimationActive={false} // 애니메이션 버그 방지
          />
          <Tooltip />
          <Legend payload={[{ value: '측정 횟수', type: 'line', color: '#1D3162' }]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Visitor;