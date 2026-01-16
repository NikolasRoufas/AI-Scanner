import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronRight, Download, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';

const Analyze: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate analysis loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  const overallScore = 78;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">Analysis Results</h1>
          <p className="text-muted-foreground mt-1 text-lg">Found <span className="text-primary font-semibold">4 opportunities</span> for improvement in your resume.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/25">
            <Download className="w-4 h-4" /> Download Report
          </Button>
        </div>
      </header>

      {/* Score Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20"
        >
          <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
            <h3 className="text-lg font-medium text-indigo-100 mb-6">Overall Score</h3>

            {/* Circular Progress Ring */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-indigo-900/50"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - overallScore / 100)}
                  className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - overallScore / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold tracking-tighter">{overallScore}</span>
                <span className="text-sm font-medium text-indigo-200 uppercase tracking-widest mt-1">Excellent</span>
              </div>
            </div>

            <div className="mt-8 w-full">
              <div className="flex justify-between text-sm text-indigo-200 mb-2">
                <span>ATS Compatibility</span>
                <span>High</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </motion.div>

        {/* Key Metrics grid */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <MetricCard
            title="Hard Skills"
            value="8/10"
            status="success"
            description="Excellent match with job requirements."
            delay={0.1}
          />
          <MetricCard
            title="Soft Skills"
            value="6/10"
            status="warning"
            description="Consider adding more leadership examples."
            delay={0.2}
          />
          <MetricCard
            title="Formatting"
            value="10/10"
            status="success"
            description="Perfectly parsed by standard ATS."
            delay={0.3}
          />
          <MetricCard
            title="Impact Metrics"
            value="4/10"
            status="error"
            description="Quantify your achievements with numbers."
            delay={0.4}
          />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Detailed Breakdown</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">Collapse All</Button>
        </div>

        <div className="grid gap-4">
          <ExpandableSection
            title="Missing Keywords"
            score="Critical"
            type="error"
            content={
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">The following keywords were found in the job description but are missing from your resume:</p>
                <div className="flex flex-wrap gap-2">
                  {['React Native', 'GraphQL', 'System Design', 'CI/CD'].map(k => (
                    <span key={k} className="px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/50 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3" /> {k}
                    </span>
                  ))}
                </div>
              </div>
            }
          />

          <ExpandableSection
            title="Experience Section Optimization"
            score="Suggestion"
            type="warning"
            content={
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your 'Senior Developer' role lists tasks but lacks results. Try changing <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Managed team</span> to <span className="font-medium text-foreground">"Led team of 5 to deliver project X, increasing revenue by Y%"</span>.
              </p>
            }
          />

          <ExpandableSection
            title="Education & Certifications"
            score="Passed"
            type="success"
            content={
              <p className="text-sm text-muted-foreground">
                Your education section is well-structured and easy to read. No changes needed.
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};

// Components

const MetricCard = ({ title, value, status, description, delay }: any) => {
  const statusColors = {
    success: "text-green-600 bg-green-50 border-green-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    error: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-card glass-panel rounded-2xl p-6 border border-border shadow-sm hover-card"
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status as keyof typeof statusColors]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <p className="text-sm text-muted-foreground leading-snug">{description}</p>
    </motion.div>
  );
}

const ExpandableSection = ({ title, score, type, content }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {icons[type as keyof typeof icons]}
          <span className="font-semibold text-foreground text-left">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{score}</span>
          {isOpen ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-border/50 bg-slate-50/50">
              <div className="pt-4">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const AnalysisSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-10 bg-slate-200 rounded-lg w-1/3" />
    <div className="grid md:grid-cols-3 gap-6">
      <div className="h-64 bg-slate-200 rounded-3xl" />
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 rounded-2xl" />)}
    </div>
  </div>
)

export default Analyze;
