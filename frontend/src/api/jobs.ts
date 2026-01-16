import { API_BASE_URL } from "./config";

interface JobDescriptionPayload {
  user_id: number;
  title: string;
  content: string;
}

export async function saveJobDescription(payload: JobDescriptionPayload) {
  const res = await fetch(`${API_BASE_URL}/job-description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

export async function getUserJobDescriptions(userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/user-job-descriptions?user_id=${userId}`
  );
  return res.json();
}
