import { API_BASE_URL } from "./config";

export async function jobSearch(query: string, location: string) {
  const res = await fetch(
    `${API_BASE_URL}/job-search?query=${query}&location=${location}`
  );
  return res.json();
}

export async function sendApplication(
  userId: number,
  jobId: number,
  cvId: number,
  coverLetter: string
) {
  const res = await fetch(`${API_BASE_URL}/send-application`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      job_id: jobId,
      cv_id: cvId,
      cover_letter: coverLetter,
    }),
  });

  return res.json();
}
