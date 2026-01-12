import React, { useEffect, useState } from "react";
import { getUserCVs } from "../api/cvs";
import { getUserJobDescriptions } from "../api/jobs";
import { analyzeCV } from "../api/analysis";

interface SimpleItem {
  id: number;
  file_name?: string;
  title?: string;
}

const Analyze: React.FC = () => {
  const userId = Number(localStorage.getItem("user_id"));

  const [cvs, setCVs] = useState<SimpleItem[]>([]);
  const [jobs, setJobs] = useState<SimpleItem[]>([]);
  const [cvId, setCvId] = useState<number>();
  const [jobId, setJobId] = useState<number>();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    getUserCVs(userId).then((res) => setCVs(res.cvs || []));
    getUserJobDescriptions(userId).then((res) =>
      setJobs(res.job_descriptions || [])
    );
  }, [userId]);

  const handleAnalyze = async () => {
    if (!cvId || !jobId) return;

    const res = await analyzeCV(userId, cvId, jobId);
    if (res.success) {
      setResult(res.analysis);
    }
  };

  return (
    <div>
      <h2>Analyze CV</h2>

      <select onChange={(e) => setCvId(Number(e.target.value))}>
        <option value="">Select CV</option>
        {cvs.map((cv) => (
          <option key={cv.id} value={cv.id}>
            {cv.file_name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setJobId(Number(e.target.value))}>
        <option value="">Select Job Description</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>

      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <>
          <h3>Score: {result.score}</h3>
          <p>{result.feedback}</p>
          <ul>
            {result.suggestions.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Analyze;
