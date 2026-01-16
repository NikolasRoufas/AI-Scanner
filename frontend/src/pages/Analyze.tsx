import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, Briefcase, Loader2, Sparkles, CheckCircle, Lightbulb, FileCheck, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import Select, { type SelectOption } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { getUserCVs } from '../api/cvs';
import { getUserJobDescriptions } from '../api/jobs';
import { analyzeCV } from '../api/analysis';
import { Link } from 'react-router-dom';

interface CV {
  id: number;
  file_name: string;
}

interface Job {
  id: number;
  title: string;
}

interface AnalysisResult {
  score: number;
  feedback: string;
  suggestions: string[];
  improved_cv: string;
}

const Analyze: React.FC = () => {
  const { user } = useAuth();
  const [cvList, setCvList] = useState<CV[]>([]);
  const [jobList, setJobList] = useState<Job[]>([]);

  const [selectedCvId, setSelectedCvId] = useState<number | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoadingData(true);
      try {
        const [cvData, jobData] = await Promise.all([
          getUserCVs(user.id),
          getUserJobDescriptions(user.id)
        ]);

        if (cvData.cvs) setCvList(cvData.cvs);
        else if (Array.isArray(cvData)) setCvList(cvData);

        if (jobData.jobs) setJobList(jobData.jobs);
        else if (Array.isArray(jobData)) setJobList(jobData);

      } catch (error) {
        console.error("Failed to load data for analysis", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAnalyze = async () => {
    if (!user || !selectedCvId || !selectedJobId) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await analyzeCV(user.id, selectedCvId, selectedJobId);
      if (response.success && response.analysis) {
        setResult(response.analysis);
      } else {
        alert("Analysis failed: " + (response.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Analysis Error", error);
      alert("An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prepare options for custom Select
  const cvOptions: SelectOption[] = cvList.map(cv => ({ label: cv.file_name, value: cv.id }));
  const jobOptions: SelectOption[] = jobList.map(job => ({ label: job.title, value: job.id }));

  return (
    <div className="space-y-8 pb-24 relative min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Run Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg ml-1">
            Select a resume and a job description to generate a tailored, AI-powered match report.
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Selection Card */}
        <div className="md:col-span-2 bg-card glass-panel rounded-3xl p-8 border border-white/20 space-y-8 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
          {/* Decorative bg gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {/* CV Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" /> Select Resume (CV)
              </label>
              {isLoadingData ? (
                <div className="h-12 bg-muted/20 animate-pulse rounded-xl" />
              ) : (
                <div className="relative">
                  <Select
                    options={cvOptions}
                    value={selectedCvId}
                    onChange={(val) => setSelectedCvId(Number(val))}
                    placeholder="Choose a CV..."
                    disabled={cvOptions.length === 0}
                  />
                  {cvOptions.length === 0 && !isLoadingData && (
                    <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 w-full animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>No CVs found. <Link to="/upload" className="underline font-bold hover:text-red-800">Upload one here</Link></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Job Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" /> Select Job Description
              </label>
              {isLoadingData ? (
                <div className="h-12 bg-muted/20 animate-pulse rounded-xl" />
              ) : (
                <div className="relative">
                  <Select
                    options={jobOptions}
                    value={selectedJobId}
                    onChange={(val) => setSelectedJobId(Number(val))}
                    placeholder="Choose a Job Description..."
                    disabled={jobOptions.length === 0}
                  />
                  {jobOptions.length === 0 && !isLoadingData && (
                    <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 w-full animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>No Jobs found. <Link to="/jobs" className="underline font-bold hover:text-red-800">Add one here</Link></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end md:justify-start border-t border-border/40 relative z-10">
            <Button
              size="lg"
              className="w-full md:w-auto min-w-[240px] shadow-lg shadow-indigo-500/20 text-base h-12"
              disabled={!selectedCvId || !selectedJobId || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Match...</span>
              ) : (
                <span className="flex items-center gap-2">Start Analysis <Play className="w-4 h-4 fill-current ml-1" /></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="rounded-3xl border border-white/20 overflow-hidden shadow-2xl glass-panel"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center p-8 border-b border-border/50 bg-gradient-to-r from-slate-50/50 via-white/50 to-slate-50/50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/50 backdrop-blur-3xl relative">
              <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider mb-2 border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-3 h-3" /> Analysis Complete
                </span>
                <h2 className="text-3xl font-bold text-foreground">Match Report</h2>
                <p className="text-muted-foreground mt-1 text-lg">Detailed compatibility analysis</p>
              </div>

              <div className="relative z-10">
                <CircularProgress value={result.score} size={110} strokeWidth={8} />
              </div>
            </div>

            <div className="p-8 space-y-10 bg-card/30">
              {/* Feedback */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Executive Summary</h3>
                </div>
                <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/50 text-foreground/80 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {result.feedback}
                </div>
              </motion.section>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Suggestions */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Key Improvements</h3>
                  </div>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (idx * 0.1) }}
                        className="flex gap-4 p-4 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors shadow-sm"
                      >
                        <div className="mt-0.5 shrink-0">
                          <CheckCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80 leading-snug">{suggestion}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Improved CV */}
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Optimized Resume</h3>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6 rounded-2xl bg-slate-950 text-slate-300 border border-slate-800 font-mono text-xs overflow-y-auto max-h-[500px] shadow-inner custom-scrollbar leading-relaxed">
                      {result.improved_cv}
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyze;
