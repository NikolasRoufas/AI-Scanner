import React, { useEffect, useState } from "react";
import { getAnalysisHistory } from "../api/analysis";

interface HistoryItem {
  id: number;
  score: number;
  cv_name: string;
  job_title: string;
  created_at: string;
}

const History: React.FC = () => {
  const userId = Number(localStorage.getItem("user_id"));
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    getAnalysisHistory(userId).then((res) => {
      if (res.success) {
        setHistory(res.history);
      }
    });
  }, [userId]);

  return (
    <div>
      <h2>Analysis History</h2>

      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <strong>{item.cv_name}</strong> → {item.job_title} | Score:{" "}
            {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
