import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Briefcase, ChevronRight, SlidersHorizontal, Plus, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { saveJobDescription, getUserJobDescriptions, deleteJobDescription } from '../api/jobs';
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
                const mappedJobs = data.jobs.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    description: job.content,
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

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this job description?")) return;

        try {
            const res = await deleteJobDescription(id);
            if (res.success) {
                setJobs(prev => prev.filter(job => job.id !== id));
            } else {
                alert("Failed to delete job.");
            }
        } catch (error) {
            console.error("Failed to delete job", error);
            alert("An error occurred while deleting.");
        }
    };

    return (
        <div className="space-y-8 relative min-h-screen pb-12">
            <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Jobs</h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-1">Manage job descriptions and analyze them against your CVs.</p>
                </div>
                <Button
                    className="shadow-lg shadow-primary/20 h-12 px-6"
                    onClick={() => setIsUploadModalOpen(true)}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Job Description

                </Button>
            </header>

            {/* Search & Filter */}
            <div className="bg-card glass-panel p-2 rounded-[1.5rem] border border-border/60 shadow-sm flex gap-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by job title, keywords..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-px bg-border/60 my-2" />
                <Button variant="ghost" className="h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground">
                    <SlidersHorizontal className="w-5 h-5" />
                </Button>
            </div>

            {/* Job List */}
            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl" />)}
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-indigo-100 dark:border-slate-700">
                        <Briefcase className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold">No jobs found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">Upload a job description to start analyzing matches.</p>
                    <Button variant="link" onClick={() => setIsUploadModalOpen(true)} className="mt-4 text-primary">
                        Upload your first job
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={job.id}
                            className="group bg-card glass-panel rounded-2xl p-6 border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 relative overflow-hidden"
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                                {/* Icon Badge */}
                                <div className="shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 flex flex-col items-center justify-center text-primary border border-indigo-100 dark:border-indigo-500/20 shadow-sm group-hover:scale-105 transition-transform">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1.5 cursor-pointer">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight truncate pr-4">
                                        {job.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-secondary">
                                            <Building2 className="w-3.5 h-3.5" /> Corporation
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-secondary">
                                            <MapPin className="w-3.5 h-3.5" /> Remote
                                        </span>
                                        {job.created_at && (
                                            <span className="flex items-center gap-1.5 ml-auto md:ml-0 text-xs opacity-70">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDelete(e, job.id)}
                                        title="Delete Job"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="text-primary hover:bg-primary/10 pl-4 pr-2"
                                    >
                                        Details
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload Modal (Refactored) */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Add New Job Description"
            >
                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex gap-3 text-sm text-indigo-800 dark:text-indigo-200">
                        <div className="mt-0.5"><Briefcase className="w-4 h-4" /></div>
                        <p>Paste the full job description here. The AI will analyze key requirements, skills, and qualifications to match against your CV.</p>
                    </div>

                    <form onSubmit={handleUploadJob} className="space-y-5">
                        <Input
                            label="Job Title"
                            placeholder="e.g. Senior Product Designer"
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            required
                            autoFocus
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Job Details / Requirements</label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                                <textarea
                                    className="relative flex min-h-[200px] w-full rounded-xl border border-input bg-background/80 backdrop-blur-sm px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary resize-none custom-scrollbar"
                                    placeholder="Paste the full job description text here..."
                                    value={newJobContent}
                                    onChange={(e) => setNewJobContent(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isSubmitting} className="shadow-lg shadow-indigo-500/25 px-8">Save Job</Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* View Details Modal (Refactored) */}
            <Modal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                title={selectedJob?.title}
            >
                {selectedJob && (
                    <div className="space-y-6 max-h-[70vh] flex flex-col">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border/50">
                            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Company</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Remote</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {selectedJob.created_at ? new Date(selectedJob.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                                {selectedJob.description && selectedJob.description.length > 20
                                    ? selectedJob.description
                                    : <div className="italic text-muted-foreground">No description content available for this job.</div>
                                }
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 flex justify-between items-center gap-4">
                            <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                            <Button className="shadow-lg shadow-indigo-500/20 w-full sm:w-auto">Run Analysis for this Job</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default JobDescriptions;
