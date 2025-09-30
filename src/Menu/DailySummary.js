import React from "react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import axios from "axios";
import "./DailySummary.css";

const DailySummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummaryData = async () => {
    try {
      const apiUrl = "http://localhost:5001 /api/measurements/${measurementId}/emotion";
      const response = await axios.get(apiUrl);

      setData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return (
    <div className="chart-container">
      <PieChart
        accessibilityLayer
        data={[
          {
            amt: 1400,
            fill: '#8884d8',
            name: 'depression',
            pv: 2400,
            uv: 31.47
          },
          {
            amt: 720,
            fill: '#83a6ed',
            name: 'anxiety',
            pv: 4567,
            uv: 26.69
          },
          {
            amt: 680,
            fill: '#8dd1e1',
            name: 'stress',
            pv: 1398,
            uv: 15.69
          },
          {
            amt: 1700,
            fill: '#82ca9d',
            name: 'anger',
            pv: 9800,
            uv: 8.22
          },
          {
            amt: 1500,
            fill: '#a4de6c',
            name: 'stability',
            pv: 3908,
            uv: 8.63
          }
        ]}
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
          data={[
            {
              amt: 1400,
              fill: '#8884d8',
              name: 'depression',
              pv: 2400,
              uv: 31.47
            },
            {
              amt: 720,
              fill: '#83a6ed',
              name: 'anxiety',
              pv: 4567,
              uv: 26.69
            },
            {
              amt: 680,
              fill: '#8dd1e1',
              name: 'stress',
              pv: 1398,
              uv: 15.69
            },
            {
              amt: 1700,
              fill: '#82ca9d',
              name: 'anger',
              pv: 9800,
              uv: 8.22
            },
            {
              amt: 1500,
              fill: '#a4de6c',
              name: 'stability',
              pv: 3908,
              uv: 8.63
            }
          ]}
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