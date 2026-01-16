import { API_BASE_URL } from "./config";

export async function uploadCV(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/upload-cv`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getUserCVs(userId?: number) {
  // If no userId is provided, try to get from localStorage (rudimentary auth)
  const id = userId || localStorage.getItem("user_id");
  if (!id) return [];

  const res = await fetch(`${API_BASE_URL}/user-cvs?user_id=${id}`);
  return res.json();
}
