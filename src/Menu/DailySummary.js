import React from "react";
import { useEffect, useState } from "react";
import {
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
      const apiUrl = "http://localhost:5001/api/users/measurements";
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
          name: 'angry',
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
      height={300}
      margin={{
        bottom: 5,
        left: 5,
        right: 5,
        top: 5
      }}
      syncMethod="index"
      width={500}
    >
      <Pie
        cornerRadius={8}
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
            name: 'angry',
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
        innerRadius={50}
        nameKey="name"
        outerRadius={80}
      >
        <Label
          dy={-7}
          fill="#000"
          fontSize={12}
          fontWeight="bold"
          position="center"
        >
          Emotion
        </Label>
        <Label
          dy={8}
          fontSize={12}
          fontWeight="bold"
          position="center"
        >
          Chart
        </Label>
        <Legend
          align="right"
          layout="vertical"
          verticalAlign="middle"
        />
      </Pie>
    </PieChart>
    
  );
};

export default DailySummary;