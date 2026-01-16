import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Briefcase, ChevronRight, SlidersHorizontal, Plus, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { saveJobDescription, getUserJobDescriptions } from '../api/jobs';
import { useAuth } from '../context/AuthContext';

interface Job {
    id: number;
    title: string;
    description?: string;
    created_at?: string;
}

const JobDescriptions: React.FC = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // Form States
    const [newJobTitle, setNewJobTitle] = useState("");
    const [newJobContent, setNewJobContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getUserJobDescriptions(user.id);
            if (data.success) {
                const mappedJobs = data.job_descriptions.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    description: "Full description content is not currently available in list view.",
                    created_at: job.created_at
                }));
                setJobs(mappedJobs);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [user]);

    const handleUploadJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            await saveJobDescription({
                user_id: user.id,
                title: newJobTitle,
                content: newJobContent
            });

            setIsUploadModalOpen(false);
            setNewJobTitle("");
            setNewJobContent("");
            fetchJobs();
        } catch (error) {
            console.error("Failed to upload job", error);
            alert("Failed to save job description");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Jobs</h1>
                    <p className="text-muted-foreground mt-1">Find roles that match your skills based on your analysis.</p>
                </div>
                <Button
                    className="shadow-lg shadow-primary/20"
                    onClick={() => setIsUploadModalOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Job
                </Button>
            </header>

            {/* Search & Filter */}
            <div className="flex gap-4 p-1">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 w-12 px-0 flex-shrink-0">
                    <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                </Button>
            </div>

            {/* Job List */}
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No jobs found</h3>
                    <p className="text-muted-foreground mt-2">Upload a job description to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={job.id}
                            className="group bg-cardGlass rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:bg-primary/[0.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 relative overflow-hidden glass-panel"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                {/* Date Badge (replaces logo) */}
                                <div className="shrink-0">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary font-medium border border-primary/20">
                                        <span className="text-xs uppercase opacity-70">Job</span>
                                        <span className="text-xl font-bold">#{job.id}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">
                                                Active
                                            </span>
                                            {job.created_at && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4 opacity-70" /> Internal
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 opacity-70" /> Remote
                                        </span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center md:self-center">
                                    <Button
                                        variant="ghost"
                                        className="group/btn text-primary hover:bg-primary/10"
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        View Details
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination Placeholder */}
            {jobs.length > 0 && (
                <div className="flex justify-center pt-8">
                    <Button variant="ghost" className="text-muted-foreground">Load More Jobs</Button>
                </div>
            )}

            {/* Upload Modal (Existing) */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setIsUploadModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 pointer-events-auto border border-border/50 max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center p-6 border-b border-border/50 sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <h2 className="text-xl font-bold">Upload New Job</h2>
                                    <button onClick={() => setIsUploadModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleUploadJob} className="p-6 space-y-4">
                                    <Input
                                        label="Job Title"
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={newJobTitle}
                                        onChange={(e) => setNewJobTitle(e.target.value)}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Job Description</label>
                                        <textarea
                                            className="flex min-h-[150px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={newJobContent}
                                            onChange={(e) => setNewJobContent(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" isLoading={isSubmitting} className="shadow-lg shadow-primary/25">Save Job</Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setSelectedJob(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 pointer-events-auto border border-border/50 flex flex-col max-h-[85vh]">
                                <div className="flex justify-between items-start p-6 border-b border-border/50 bg-muted/20">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{selectedJob.title}</h2>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Internal Upload</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Remote</span>
                                            {selectedJob.created_at && (
                                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(selectedJob.created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-muted-foreground hover:text-foreground transition-all bg-card p-2 rounded-full hover:bg-muted"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Job Description</h3>
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                        {/* Since backend doesn't return content in list, we show a placeholder explanation or the default text */}
                                        {selectedJob.description && selectedJob.description.length > 80
                                            ? selectedJob.description
                                            : "Full description content is not currently available in this view. In a production environment, this would fetch the complete job details from the server."}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                                    <Button className="shadow-lg shadow-primary/20">Analyze CV for this Job</Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDescriptions;
