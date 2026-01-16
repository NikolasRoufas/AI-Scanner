import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Cpu, X, Clock, Calendar, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { getUserCVs, uploadCV, deleteCV } from '../api/cvs';
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this CV? This cannot be undone.")) return;
    try {
      const res = await deleteCV(id);
      if (res.success) {
        setCvHistory(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Failed to delete CV.");
      }
    } catch (error) {
      console.error("Failed to delete CV", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Resume</h1>
          </div>
          <p className="text-muted-foreground text-lg ml-1">Get instant, AI-powered feedback on your CV.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 space-y-8"
        >
          {/* Main Upload Area */}
          <div
            className={`
                relative overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-300 ease-out
                flex flex-col items-center justify-center text-center p-12 h-[500px] group glass-panel
                ${isDragging
                ? 'border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10'
                : 'border-border/60 hover:border-primary/40'
              }
                ${file ? 'border-primary/50 bg-primary/5' : ''}
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
                  className="space-y-8 relative z-10 w-full max-w-md"
                >
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-75" />
                    <div className="absolute inset-4 rounded-full bg-indigo-500/10" />

                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border border-white/50 dark:border-white/10">
                      <Upload className="w-12 h-12 text-primary/80 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight">Drag & drop your PDF</h3>
                    <p className="text-muted-foreground text-base">
                      or <span className="text-primary font-semibold underline decoration-dotted underline-offset-4 cursor-pointer hover:text-primary/80" onClick={() => document.getElementById('file-upload')?.click()}>browse files</span> from your computer
                    </p>
                  </div>

                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="h-14 px-10 text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 rounded-2xl w-full sm:w-auto"
                  >
                    Select Resume File
                  </Button>
                  <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest pt-4">
                    PDF up to 10MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-sm relative z-10"
                >
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/20 dark:border-white/5">
                    <div className="flex items-start gap-5 mb-8">
                      <div className="p-4 bg-red-100/50 dark:bg-red-500/10 text-red-500 rounded-2xl shadow-inner">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="flex-1 text-left min-w-0 pt-1">
                        <h4 className="font-bold text-lg truncate pr-4 text-foreground">{file.name}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all hover:text-destructive"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <Button
                      fullWidth
                      className="h-14 text-lg shadow-lg shadow-indigo-500/25"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 animate-spin" /> Analyzing File...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center font-bold">
                          Upload & Analyze <Upload className="w-5 h-5 group-hover/btn:animate-bounce" />
                        </span>
                      )}
                    </Button>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-6 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <X className="w-4 h-4" /> Cancel Selection
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* History Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-500" />
              </div>
              Recent Uploads
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{cvHistory.length}</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-muted/20 animate-pulse" />
                ))}
              </div>
            ) : cvHistory.length === 0 ? (
              <div className="p-8 rounded-3xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                <FileText className="w-10 h-10 mb-3 opacity-30" />
                <p className="font-medium">No previous uploads</p>
              </div>
            ) : (
              cvHistory.map((cv, idx) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-4 rounded-2xl bg-card glass-panel border border-border/60 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h4 className="font-bold text-sm truncate text-foreground leading-tight" title={cv.file_name}>
                        {cv.file_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(cv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(cv.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCV;
