import { API_BASE_URL } from "./config";

export async function saveJobDescription(
  userId: number,
  title: string,
  content: string
) {
  const res = await fetch(`${API_BASE_URL}/job-description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, title, content }),
  });

  return res.json();
}

export async function getUserJobDescriptions(userId: number) {
  const res = await fetch(
    `${API_BASE_URL}/user-job-descriptions?user_id=${userId}`
  );
  return res.json();
}
