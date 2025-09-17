import React from "react";
import {
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
      count: 0,
    },
    {
      date: "2025-09-08",
      count: 0,
    },
    {
      date: "2025-09-09",
      count: 0,
    },
    {
      date: "2025-09-10",
      count: 0,
    },
    {
      date: "2025-09-11",
      count: 0,
    },
    {
      date: "2025-09-12",
      count: 0,
    },
    {
      date: "2025-09-13",
      count: 0,
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
    <div style={{ width: "100%", height: 400 }}>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="#2D6DFF"
          strokeWidth={2}
        />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
};

export default Visitor;
