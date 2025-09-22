import React from "react";
import "./DailySummary.css";

const DailySummary = () => {
  // 최근 7일 날짜 자동 생성
  const getLast7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD 형식
        pageViews: Math.floor(Math.random() * 15), // 더미
        visitors: Math.floor(Math.random() * 10),
        signups: Math.floor(Math.random() * 2),
        posts: Math.floor(Math.random() * 5),
      });
    }
    return days;
  };

  const data = getLast7Days();

  // 합계 계산
  const recentTotal = {
    pageViews: data.reduce((sum, d) => sum + d.pageViews, 0),
    visitors: data.reduce((sum, d) => sum + d.visitors, 0),
    signups: data.reduce((sum, d) => sum + d.signups, 0),
    posts: data.reduce((sum, d) => sum + d.posts, 0),
    comments: data.reduce((sum, d) => sum + d.comments, 0),
  };

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
