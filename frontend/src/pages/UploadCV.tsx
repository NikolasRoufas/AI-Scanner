import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, Trash2, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { uploadCV, getUserCVs } from '../api/cvs';

const UploadCV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [userCVs, setUserCVs] = useState<{ id: number; file_name: string; created_at: string }[]>([]);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const cvs = await getUserCVs();
      setUserCVs(cvs || []);
    } catch (error) {
      console.error("Failed to fetch CVs", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // user_id is handled by backend from token? 
      // The current API might require explicit user_id if no proper auth middleware
      // Assuming userId is passed or stored in session for now based on previous impl
      const storedUserId = localStorage.getItem("user_id");
      // Append user_id manually if API requires it as form field not header
      if (storedUserId) formData.append('user_id', storedUserId);

      await uploadCV(formData);
      setUploadSuccess(true);
      setFile(null);
      fetchCVs();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage CVs</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Upload new resumes or manage existing ones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Upload New CV</h2>

          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[hsl(var(--border))] rounded-2xl p-8 transition-colors hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--accent)/0.05)]">
            <input
              type="file"
              id="cv-upload"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />

            {!file ? (
              <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-[hsl(var(--primary))]" />
                </div>
                <p className="font-medium text-lg">Click to upload</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">PDF or DOCX (Max 5MB)</p>
              </label>
            ) : (
              <div className="flex flex-col items-center text-center w-full">
                <div className="h-16 w-16 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mb-4 relative">
                  <File className="h-8 w-8 text-[hsl(var(--primary))]" />
                  <button
                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                    className="absolute -top-1 -right-1 bg-[hsl(var(--destructive))] text-white rounded-full p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <p className="font-medium text-lg truncate max-w-full px-4">{file.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                <Button
                  onClick={handleUpload}
                  className="mt-6 w-full"
                  isLoading={isUploading}
                >
                  Upload Resume
                </Button>
              </div>
            )}
          </div>

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" /> Upload successful!
            </motion.div>
          )}
        </Card>

        {/* List Section */}
        <Card className="h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Your CVs</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px]">
            {userCVs.length === 0 ? (
              <div className="text-center text-[hsl(var(--muted-foreground))] py-12">
                No CVs uploaded yet.
              </div>
            ) : (
              userCVs.map((cv) => (
                <div key={cv.id} className="group p-4 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--accent)/0.05)] transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                      <File className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[150px]">{cv.file_name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(cv.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadCV;
