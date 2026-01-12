import { API_BASE_URL } from "./config";

export async function uploadCV(file: File, userId: number) {
  const formData = new FormData();
  formData.append("cv", file);
  formData.append("user_id", userId.toString());

  const res = await fetch(`${API_BASE_URL}/upload-cv`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getUserCVs(userId: number) {
  const res = await fetch(`${API_BASE_URL}/user-cvs?user_id=${userId}`);
  return res.json();
}
