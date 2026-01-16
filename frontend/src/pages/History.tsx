import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, ArrowUpRight, Briefcase, Hash, Trophy, X, CheckCircle, Lightbulb, FileCheck, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
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
    <div className="space-y-8 relative">
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analysis History</h1>
          <p className="text-muted-foreground mt-1">Track your resume improvements over time.</p>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-2xl border border-border shadow-sm max-w-2xl">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <input
          type="text"
          placeholder="Search by file name or job title..."
          className="flex-1 outline-none text-sm bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* History Table/List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading analysis history...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No analysis history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4 whitespace-nowrap"><Hash className="w-3 h-3 inline mr-1" /> ID</th>
                  <th className="px-6 py-4 whitespace-nowrap"><Trophy className="w-3 h-3 inline mr-1" /> Score</th>
                  <th className="px-6 py-4 whitespace-nowrap"><Calendar className="w-3 h-3 inline mr-1" /> Date</th>
                  <th className="px-6 py-4 whitespace-nowrap"><FileText className="w-3 h-3 inline mr-1" /> CV File Name</th>
                  <th className="px-6 py-4 whitespace-nowrap"><Briefcase className="w-3 h-3 inline mr-1" /> Job Title</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                                px-2.5 py-1 rounded-full text-xs font-bold
                                ${item.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          item.score >= 60 ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                            `}>
                        {item.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        {item.cv_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {item.job_title}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id || loadingReportId === item.id}
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
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => handleViewReport(item.id)}
                        disabled={loadingReportId === item.id || deletingId === item.id}
                      >
                        {loadingReportId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : "Report"}
                        {loadingReportId !== item.id && <ArrowUpRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      <AnimatePresence>
        {selectedResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedResult(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-3xl w-full max-w-4xl pointer-events-auto border border-border/50 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-border/50 bg-muted/20">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      Analysis Report
                      <span className={`px-3 py-1 rounded-full text-base font-bold ${selectedResult.score >= 80 ? 'bg-green-100 text-green-700' :
                        selectedResult.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                        Score: {selectedResult.score.toFixed(1)}
                      </span>
                    </h2>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> {selectedResult.job_title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-muted-foreground hover:text-foreground transition-all bg-card p-2 rounded-full hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                  {/* Feedback Section */}
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground dark:text-slate-200">
                      <FileText className="w-5 h-5 text-indigo-500 " />
                      Executive Feedback
                    </h3>
                    <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 text-foreground/90 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {selectedResult.feedback || "No specific feedback provided."}
                    </div>
                  </section>

                  {/* Suggestions Section */}
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground dark:text-slate-200">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Key Suggestions
                    </h3>
                    {selectedResult.suggestions && selectedResult.suggestions.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {selectedResult.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground dark:text-slate-200">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No specific suggestions generated.</p>
                    )}
                  </section>

                  {/* Improved CV Section */}
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground dark:text-slate-200">
                      <FileCheck className="w-5 h-5 text-emerald-500" />
                      Improved CV Version
                    </h3>
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border font-mono text-xs md:text-sm text-foreground/80 dark:text-slate-100 overflow-x-auto whitespace-pre-wrap max-h-[400px]">
                      {selectedResult.improved_cv || "No improved version generated."}
                    </div>
                  </section>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50 bg-muted/10 flex justify-end gap-3 rounded-b-2xl">
                  <Button variant="outline" onClick={() => setSelectedResult(null)}>Close</Button>
                  <Button className="shadow-lg shadow-primary/20">Download Report (PDF)</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
