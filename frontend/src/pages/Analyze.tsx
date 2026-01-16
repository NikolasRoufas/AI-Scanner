import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, Briefcase, CheckCircle, Download, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getUserCVs } from '../api/cvs';
import { getUserJobDescriptions } from '../api/jobs';
import { analyzeCV } from '../api/analysis';
// Import markdown renderer if needed for rich text feedback, for now simple text


const Analyze: React.FC = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedCV, setSelectedCV] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      getUserCVs(user.id).then(setCvs).catch(console.error);
      getUserJobDescriptions(user.id).then(setJobs).catch(console.error);
    }
  }, [user]);

  const handleAnalyze = async () => {
    if (!selectedCV || !selectedJob || !user?.id) return;
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    // Simulate loading steps for better UX
    try {
      const data = await analyzeCV(user.id, selectedCV, selectedJob);
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 60) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analyze CV</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Match your resume against a job description to get AI-powered insights.</p>
      </div>

      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="flex flex-col h-[400px]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[hsl(var(--primary))]" /> Select CV
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {cvs.map(cv => (
                <div
                  key={cv.id}
                  onClick={() => setSelectedCV(cv.id)}
                  className={`p - 4 rounded - xl border cursor - pointer transition - all flex items - center justify - between ${selectedCV === cv.id
                    ? 'bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]'
                    } `}
                >
                  <span className="font-medium truncate">{cv.file_name}</span>
                  {selectedCV === cv.id && <CheckCircle className="h-5 w-5 text-[hsl(var(--primary))]" />}
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col h-[400px]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[hsl(var(--primary))]" /> Select Job Description
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`p - 4 rounded - xl border cursor - pointer transition - all flex items - center justify - between ${selectedJob === job.id
                    ? 'bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]'
                    } `}
                >
                  <span className="font-medium truncate">{job.title}</span>
                  {selectedJob === job.id && <CheckCircle className="h-5 w-5 text-[hsl(var(--primary))]" />}
                </div>
              ))}
            </div>
          </Card>

          <div className="col-span-1 lg:col-span-2 flex justify-center">
            {error && (
              <div className="mb-4 text-red-500 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}
            <Button
              size="lg"
              disabled={!selectedCV || !selectedJob || isAnalyzing}
              onClick={handleAnalyze}
              className="w-full max-w-md shadow-xl shadow-purple-500/20"
            >
              {isAnalyzing ? (
                <>Processing...</>
              ) : (
                <>Start Analysis <Play className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <Card className="flex flex-col items-center justify-center p-8">
              <h3 className="text-lg font-medium text-[hsl(var(--muted-foreground))] mb-4">Match Score</h3>
              <div className={`relative w - 40 h - 40 rounded - full border - 8 flex items - center justify - center ${getScoreColor(result.score)} `}>
                <span className="text-5xl font-bold">{result.score}%</span>
              </div>
            </Card>

            {/* Quick Feedback */}
            <Card className="md:col-span-2 p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
              <div className="prose prose-invert max-w-none text-sm">
                {/* Very simple rendering if 'feedback' is just text */}
                <p>{result.feedback}</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" /> Improvements
              </h3>
              <div className="prose prose-invert max-w-none text-sm text-[hsl(var(--muted-foreground))]">
                {/* If suggestions is a list or markdown */}
                <div className="whitespace-pre-wrap">{result.suggestions}</div>
              </div>
            </Card>

            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Optimized CV</h3>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
              <div className="bg-[hsl(var(--background))] p-4 rounded-xl border border-[hsl(var(--border))] max-h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {result.improved_cv}
              </div>
            </Card>
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="secondary" onClick={() => setResult(null)}>
              <RefreshCw className="mr-2 h-4 w-4" /> New Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analyze;
