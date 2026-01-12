import { API_BASE_URL } from "./config";

export async function analyzeCV(
  userId: number,
  cvId: number,
  jobDescriptionId: number
) {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      cv_id: cvId,
      job_description_id: jobDescriptionId,
    }),
  });

  return res.json();
}

export async function getAnalysisHistory(userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/analysis-history?user_id=${userId}`
  );
  return res.json();
}

export async function getAnalysisResult(resultId: number) {
  const res = await fetch(
    `${API_BASE_URL}/analysis-result/${resultId}`
  );
  return res.json();
}

export function exportImprovedCV(resultId: number) {
  window.open(`${API_BASE_URL}/export-cv/${resultId}?format=txt`, "_blank");
}
