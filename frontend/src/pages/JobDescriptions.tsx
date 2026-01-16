import React, { useState, useEffect } from 'react';

import { Plus, Briefcase, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
// We'll need to create or update this API file
import { saveJobDescription, getUserJobDescriptions } from '../api/jobs';

const JobDescriptions: React.FC = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<{ id: number; title: string; content: string; created_at: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', content: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, [user]);

    const fetchJobs = async () => {
        if (!user?.id) return;
        try {
            const data = await getUserJobDescriptions(user.id);
            setJobs(data || []);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setIsSaving(true);
        try {
            await saveJobDescription({ ...newJob, user_id: user.id });
            setIsModalOpen(false);
            setNewJob({ title: '', content: '' });
            fetchJobs();
        } catch (err) {
            console.error("Failed to save job", err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Job Descriptions</h1>
                    <p className="text-[hsl(var(--muted-foreground))]">Manage job postings to target your resume.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-purple-500/20">
                    <Plus className="mr-2 h-5 w-5" /> Add New Job
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-[hsl(var(--muted-foreground))]">
                        {searchTerm ? 'No jobs found matching your search.' : 'No job descriptions saved yet. Add one to get started!'}
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <Card key={job.id} className="group hover:border-[hsl(var(--primary)/0.5)] transition-all cursor-pointer flex flex-col h-[280px]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--secondary))] flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-[hsl(var(--primary))]" />
                                </div>
                                {/* Placeholder for actions like delete */}
                            </div>

                            <h3 className="text-lg font-semibold mb-2 line-clamp-1" title={job.title}>{job.title}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-4 flex-1">
                                {job.content}
                            </p>

                            <div className="mt-auto pt-4 border-t border-[hsl(var(--border))] flex justify-between items-center text-sm text-[hsl(var(--muted-foreground))]">
                                <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Job Description">
                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Job Title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        placeholder="e.g. Senior Product Designer"
                        required
                        autoFocus
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-[hsl(var(--muted-foreground))]">Job Description</label>
                        <textarea
                            className="flex min-h-[150px] w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background)/0.5)] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                            placeholder="Paste the full job description text here..."
                            value={newJob.content}
                            onChange={(e) => setNewJob({ ...newJob, content: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isSaving}>Save Job</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default JobDescriptions;
