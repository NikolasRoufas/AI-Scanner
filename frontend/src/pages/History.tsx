import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, ArrowUpRight, Briefcase, Hash, Trophy, CheckCircle, Lightbulb, FileCheck, Loader2, Trash2 } from 'lucide-react';

import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CircularProgress from '../components/ui/CircularProgress';
import { getAnalysisHistory, getAnalysisResult, deleteAnalysisResult } from '../api/analysis';
import { useAuth } from '../context/AuthContext';

interface AnalysisResult {
  id: number;
  score: number;
  cv_name: string;
  job_title: string;
  created_at: string;
}

interface FullAnalysisResult extends AnalysisResult {
  feedback: string;
  suggestions: string[];
  improved_cv: string;
}

const History: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Report Modal State
  const [selectedResult, setSelectedResult] = useState<FullAnalysisResult | null>(null);
  const [loadingReportId, setLoadingReportId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getAnalysisHistory(user.id);
        if (data.success && data.history) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleViewReport = async (id: number) => {
    setLoadingReportId(id);
    try {
      const data = await getAnalysisResult(id);
      if (data.success && data.result) {
        setSelectedResult(data.result);
      }
    } catch (error) {
      console.error("Failed to fetch report details", error);
      alert("Could not load report details.");
    } finally {
      setLoadingReportId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis record? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await deleteAnalysisResult(id);
      if (res.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Failed to delete analysis.");
      }
    } catch (error) {
      console.error("Failed to delete analysis", error);
      alert("An error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHistory = history.filter(item =>
    item.cv_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 relative pb-12">
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Analysis History</h1>
          </div>
          <p className="text-muted-foreground text-lg ml-1">Track your resume improvements and past analysis reports.</p>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-card glass-panel p-2 rounded-[1.5rem] border border-border/60 shadow-sm flex gap-2 max-w-3xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by file name, job title..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-px bg-border/60 my-2" />
        <div className="relative">
          <select className="h-12 bg-transparent border-none text-sm font-medium text-foreground rounded-xl px-4 outline-none cursor-pointer hover:bg-secondary/50 transition-colors appearance-none pr-10">
            <option>All Time</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
          <ArrowUpRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-45" />
        </div>
      </div>

      {/* History Table/List */}
      <div className="bg-card glass-panel rounded-3xl border border-border/60 overflow-hidden shadow-xl shadow-indigo-500/5">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium">No analysis history found</h3>
            <p className="text-muted-foreground mt-1">Run a new analysis to see results appearing here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <th className="px-6 py-5 whitespace-nowrap"><Hash className="w-3 h-3 inline mr-1 opacity-70" /> ID</th>
                  <th className="px-6 py-5 whitespace-nowrap"><Trophy className="w-3 h-3 inline mr-1 opacity-70" /> Score</th>
                  <th className="px-6 py-5 whitespace-nowrap"><Calendar className="w-3 h-3 inline mr-1 opacity-70" /> Date</th>
                  <th className="px-6 py-5 whitespace-nowrap"><FileText className="w-3 h-3 inline mr-1 opacity-70" /> CV File</th>
                  <th className="px-6 py-5 whitespace-nowrap"><Briefcase className="w-3 h-3 inline mr-1 opacity-70" /> Job Title</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`
                            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                            ${item.score >= 80 ? 'bg-green-100/50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                          item.score >= 60 ? 'bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                            'bg-red-100/50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}
                        `}>
                        {item.score >= 80 ? <CheckCircle className="w-3 h-3" /> : <Loader2 className="w-3 h-3" />}
                        {item.score.toFixed(0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground/70 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-primary">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        {item.cv_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {item.job_title}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id || loadingReportId === item.id}
                        title="Delete Analysis"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10 pl-3 pr-2"
                        onClick={() => handleViewReport(item.id)}
                        disabled={loadingReportId === item.id || deletingId === item.id}
                      >
                        {loadingReportId === item.id ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Loading...</span>
                        ) : (
                          <span className="flex items-center gap-1 font-semibold">View Report <ArrowUpRight className="w-3.5 h-3.5" /></span>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Details Modal (Refactored) */}
      <Modal
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        title={selectedResult ? `Analysis Report #${selectedResult.id}` : "Detail View"}
      >
        {selectedResult && (
          <div className="flex flex-col max-h-[85vh] -mx-2">
            {/* Header Info */}
            <div className="px-2 pb-6 border-b border-border/50 flex flex-col md:flex-row gap-6 items-center">
              <div className="shrink-0">
                <CircularProgress value={selectedResult.score} size={80} strokeWidth={6} showValue={true} />
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedResult.created_at).toLocaleString()}
                </div>
                <h2 className="text-xl font-bold text-foreground">{selectedResult.cv_name}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/50 border border-border text-sm font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  For: {selectedResult.job_title}
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto custom-scrollbar px-2 py-6 space-y-8 flex-1">
              {/* Feedback Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Executive Feedback</h3>
                </div>
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 text-foreground/90 text-sm leading-relaxed shadow-inner">
                  {selectedResult.feedback || "No specific feedback provided."}
                </div>
              </div>

              {/* Suggestions Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Key Suggestions</h3>
                </div>
                <div className="grid gap-3">
                  {selectedResult.suggestions && selectedResult.suggestions.length > 0 ? (
                    selectedResult.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-card border border-border/60 hover:border-amber-400/30 transition-colors shadow-sm">
                        <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-green-500" /></div>
                        <span className="text-sm font-medium text-foreground/80">{suggestion}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic pl-2">No specific suggestions generated.</p>
                  )}
                </div>
              </div>

              {/* Improved CV Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Improved Version</h3>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent -z-10 rounded-2xl" />
                  <div className="p-5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs border border-slate-800 overflow-x-auto whitespace-pre-wrap max-h-[300px] shadow-inner custom-scrollbar leading-relaxed">
                    {selectedResult.improved_cv || "No improved version generated."}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 mt-auto border-t border-border/50 flex justify-end gap-3 px-2">
              <Button variant="outline" onClick={() => setSelectedResult(null)}>Close</Button>
              <Button className="shadow-lg shadow-indigo-500/20">Download Report PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;
