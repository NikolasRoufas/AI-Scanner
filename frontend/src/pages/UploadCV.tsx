import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Cpu, X, ArrowRight, Clock, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import { getUserCVs, uploadCV } from '../api/cvs';
import { useAuth } from '../context/AuthContext';

interface CV {
  id: number;
  file_name: string;
  created_at: string;
}

const UploadCV: React.FC = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [cvHistory, setCvHistory] = useState<CV[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);


  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setIsLoadingHistory(true);
      try {
        const data = await getUserCVs(user.id);
        if (data.cvs) {
          setCvHistory(data.cvs);
        } else if (Array.isArray(data)) {
          // Fallback catch if API structure differs
          setCvHistory(data);
        }
      } catch (err) {
        console.error("Failed to load CV history", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('user_id', user.id.toString());

      const response = await uploadCV(formData);

      if (response.success || response.cv_id) {
        // Refresh history
        const data = await getUserCVs(user.id);
        if (data.cvs) setCvHistory(data.cvs);
        else if (Array.isArray(data)) setCvHistory(data);

        setFile(null);
        // Optional: Add a toast notification here if available
      } else {
        alert("Upload failed: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400">
          Upload Resume
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto lg:mx-0">
          Get instant, AI-powered feedback. We analyze your CV against <span className="text-primary font-medium">50+ ATS parameters</span> to ensure you stand out.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Main Upload Area */}
        <div className="space-y-8">
          <div
            className={`
                relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
                flex flex-col items-center justify-center text-center p-12 h-[400px] group
                ${isDragging
                ? 'border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10'
                : 'border-border/60 bg-card/50 hover:bg-card/80 hover:border-primary/30'
              }
                ${file ? 'border-primary/50' : ''}
              `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf"
              onChange={handleFileInput}
            />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6 relative z-10"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/20 dark:to-slate-800/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Upload className="w-10 h-10 text-primary/80 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Drag & drop your PDF here</h3>
                    <p className="text-muted-foreground">or click to browse local files</p>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="h-12 px-8 text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground pt-4 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1 rounded-full inline-block">
                    Supported format: PDF (Max 10MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-sm relative z-10"
                >
                  <div className="bg-card glass-panel rounded-2xl p-6 shadow-xl relative overflow-hidden ring-1 ring-border/50">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="font-semibold truncate pr-4 text-foreground">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <Button
                      className="w-full h-12 text-base shadow-lg shadow-indigo-500/25 relative overflow-hidden group/btn"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" /> Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Upload CV <Upload className="w-4 h-4 group-hover/btn:animate-bounce" />
                        </span>
                      )}
                    </Button>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-6 text-sm text-muted-foreground hover:text-primary underline decoration-dotted underline-offset-4 transition-colors"
                  >
                    Choose a different file
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* History Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground/80">
              <Clock className="w-5 h-5 text-primary" />
              Your Uploaded CVs
            </h3>

            {isLoadingHistory ? (
              <div className="text-sm text-muted-foreground animate-pulse">Loading previously uploaded CVs...</div>
            ) : cvHistory.length === 0 ? (
              <div className="p-8 rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <p>No previous uploads found.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {cvHistory.map((cv) => (
                  <div
                    key={cv.id}
                    className="group p-4 rounded-2xl bg-cardGlass border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 flex items-start gap-4"
                  >
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm truncate text-foreground" title={cv.file_name}>
                        {cv.file_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(cv.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>
          {/* Sidebar removed for focused upload tab view */}
        </div>
      </motion.div>
    </div>
  );
};

export default UploadCV;
