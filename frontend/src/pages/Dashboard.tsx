import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart2, Plus, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAnalysisHistory } from '../api/analysis';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalAnalyses: 0,
        avgScore: 0,
        recentActivity: [] as any[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const history = await getAnalysisHistory();
                if (Array.isArray(history)) {
                    const total = history.length;
                    const avg = total > 0
                        ? history.reduce((acc, curr) => acc + (curr.score || 0), 0) / total
                        : 0;

                    setStats({
                        totalAnalyses: total,
                        avgScore: Math.round(avg),
                        recentActivity: history.slice(0, 3)
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Welcome back, {user?.email}</p>
                </div>
                <Button onClick={() => navigate('/analyze')} size="lg" className="shadow-lg shadow-purple-500/20">
                    <Plus className="mr-2 h-5 w-5" /> New Analysis
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={item}>
                    <Card className="h-full relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-[hsl(var(--muted-foreground))]">Total Analyses</h3>
                            <div className="text-4xl font-bold mt-2">{stats.totalAnalyses}</div>
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="h-full relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BarChart2 className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-medium text-[hsl(var(--muted-foreground))]">Avg. Match Score</h3>
                            <div className="text-4xl font-bold mt-2 flex items-baseline gap-2">
                                {stats.avgScore}<span className="text-lg text-[hsl(var(--muted-foreground))]">/100</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="h-full flex flex-col justify-center items-start gap-4 bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-transparent border-[hsl(var(--primary)/0.2)]">
                        <h3 className="text-lg font-semibold">Start optimizing now</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Upload a new CV or Job Description to get started.</p>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => navigate('/upload')}>
                                Upload CV
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => navigate('/jobs')}>
                                Add Job
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div variants={item} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-4">
                    {stats.recentActivity.length === 0 ? (
                        <Card className="p-8 text-center text-[hsl(var(--muted-foreground))]">
                            No recent activity found. Start your first analysis!
                        </Card>
                    ) : (
                        stats.recentActivity.map((activity: any, i) => (
                            <Card key={activity.id || i} className="flex items-center justify-between p-4 hover:bg-[hsl(var(--accent)/0.05)] transition-colors cursor-pointer" onClick={() => navigate(`/analyze`)}> {/* ideally link to result detail */}
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center text-[hsl(var(--primary))]">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Analysis Result #{activity.id}</h4>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{new Date(activity.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`text-lg font-bold ${activity.score >= 80 ? 'text-green-500' :
                                        activity.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {activity.score}%
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
