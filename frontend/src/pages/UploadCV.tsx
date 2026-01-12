import React, { useState } from "react";
import { uploadCV } from "../api/cvs";

const UploadCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const userId = Number(localStorage.getItem("user_id"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const result = await uploadCV(file, userId);

    if (result.success) {
      setMessage("CV uploaded successfully!");
    } else {
      setMessage(result.error || "Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload CV</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadCV;
