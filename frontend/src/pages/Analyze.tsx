import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FileText, Briefcase, Loader2, Sparkles, CheckCircle, Lightbulb, FileCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getUserCVs } from '../api/cvs';
import { getUserJobDescriptions } from '../api/jobs';
import { analyzeCV } from '../api/analysis';

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

        // Handle potential varied API responses (array vs object)
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
    setResult(null); // Clear previous result
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


  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 relative min-h-screen">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          Run Analysis
        </h1>
        <p className="text-muted-foreground">Select a CV and a Job Description to generate a tailored match report.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Selection Card */}
        <div className="md:col-span-2 bg-card glass-panel rounded-3xl p-8 border border-border space-y-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            {/* CV Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" /> Select Resume (CV)
              </label>
              {isLoadingData ? (
                <div className="h-12 bg-muted/20 animate-pulse rounded-xl" />
              ) : (
                <select
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedCvId || ""}
                  onChange={(e) => setSelectedCvId(Number(e.target.value))}
                >
                  <option value="" disabled>-- Choose a CV --</option>
                  {cvList.map(cv => (
                    <option key={cv.id} value={cv.id}>{cv.file_name}</option>
                  ))}
                </select>
              )}
              {cvList.length === 0 && !isLoadingData && (
                <p className="text-xs text-destructive">No CVs found. Please upload one first.</p>
              )}
            </div>

            {/* Job Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" /> Select Job Description
              </label>
              {isLoadingData ? (
                <div className="h-12 bg-muted/20 animate-pulse rounded-xl" />
              ) : (
                <select
                  className="w-full h-12 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedJobId || ""}
                  onChange={(e) => setSelectedJobId(Number(e.target.value))}
                >
                  <option value="" disabled>-- Choose a Job --</option>
                  {jobList.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              )}
              {jobList.length === 0 && !isLoadingData && (
                <p className="text-xs text-destructive">No jobs found. Please add one first.</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              size="lg"
              className="w-full md:w-auto min-w-[200px] shadow-lg shadow-indigo-500/20"
              disabled={!selectedCvId || !selectedJobId || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</span>
              ) : (
                <span className="flex items-center gap-2">Start Analysis <Play className="w-4 h-4 fill-current" /></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card glass-panel rounded-3xl border border-border overflow-hidden shadow-2xl space-y-0"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-border/50 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                <p className="text-muted-foreground mt-1">AI-generated compatibility report</p>
              </div>
              <div className={`
                        flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-4
                        ${result.score >= 80 ? 'border-green-500/20 bg-green-50 dark:bg-green-900/10 text-green-600' :
                  result.score >= 60 ? 'border-yellow-500/20 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600' :
                    'border-red-500/20 bg-red-50 dark:bg-red-900/10 text-red-600'}
                   `}>
                <span className="text-2xl font-bold">{result.score.toFixed(0)}</span>
                <span className="text-[10px] uppercase font-bold opacity-70">Score</span>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Feedback */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <FileText className="w-5 h-5 text-indigo-500" /> Executive Summary
                </h3>
                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 text-foreground/90 dark:text-slate-100 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {result.feedback}
                </div>
              </section>

              {/* Suggestions */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Key Improvements
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-border/60 shadow-sm hover:border-primary/30 transition-colors"
                    >
                      <div className="mt-0.5">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-sm text-foreground/80 dark:text-slate-200 leading-snug">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Improved CV */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <FileCheck className="w-5 h-5 text-emerald-500" /> Optimized Resume Content
                </h3>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-border font-mono text-sm text-foreground/80 dark:text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-[500px] shadow-inner custom-scrollbar">
                  {result.improved_cv}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyze;
