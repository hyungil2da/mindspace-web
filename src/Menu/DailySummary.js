import React, { useState, useEffect } from "react";
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

  /*
  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        pageViews: Math.floor(Math.random() * 15),
        visitors: Math.floor(Math.random() * 10),
        signups: Math.floor(Math.random() * 2),
        posts: Math.floor(Math.random() * 5),
      });
    }
    return days;
  };
  */

  // const totaldata = getLast7Days();

  const recentTotal = {
    pageViews: data.reduce((sum, d) => sum + d.pageViews, 0),
    visitors: data.reduce((sum, d) => sum + d.visitors, 0),
    signups: data.reduce((sum, d) => sum + d.signups, 0),
    posts: data.reduce((sum, d) => sum + d.posts, 0),
    comments: data.reduce((sum, d) => sum + d.comments, 0),
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>데이터 불러오기 실패 {error.message}</div>;
  }

  return (
    <div className="daily-summary">
      <table className="summary-table">
        <thead>
          <tr>
            <th>일자</th>
            <th>페이지뷰</th>
            <th>방문자</th>
            <th>가입</th>
            {/*<th>새 글</th>*/}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.pageViews}</td>
              <td>{row.visitors}</td>
              <td>{row.signups}</td>
              {/*<td>{row.posts}</td>*/}
            </tr>
          ))}
          <tr className="summary-sum">
            <td>최근 7일 합계</td>
            <td>{recentTotal.pageViews}</td>
            <td>{recentTotal.visitors}</td>
            <td>{recentTotal.signups}</td>
            {/*<td>{recentTotal.posts}</td>*/}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DailySummary;