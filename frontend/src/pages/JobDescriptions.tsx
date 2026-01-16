import React, { useState } from 'react';
import { Search, MapPin, Building2, Briefcase, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

// Mock Data
const JOBS = [
    {
        id: 1,
        title: "Senior Frontend Engineer",
        company: "TechFlow Solutions",
        location: "Remote",
        type: "Full-time",
        logo: "TF",
        color: "bg-blue-100 text-blue-700",
        description: "We are looking for an experienced React developer to lead our core product team."
    },
    {
        id: 2,
        title: "Product Designer",
        company: "Creative Zen",
        location: "New York, NY",
        type: "Hybrid",
        logo: "CZ",
        color: "bg-purple-100 text-purple-700",
        description: "Join our award-winning design team creating next-gen financial tools."
    },
    {
        id: 3,
        title: "Backend Specialist",
        company: "DataMinds",
        location: "San Francisco, CA",
        type: "Full-time",
        logo: "DM",
        color: "bg-emerald-100 text-emerald-700",
        description: "Scale our distributed systems handling millions of transactions daily."
    },
];

const JobDescriptions: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Jobs</h1>
                    <p className="text-muted-foreground mt-1">Find roles that match your skills based on your analysis.</p>
                </div>
                <Button className="shadow-lg shadow-primary/20">
                    Upload New Job
                </Button>
            </header>

            {/* Search & Filter */}
            <div className="flex gap-4 p-1">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by job title, company, or keywords..."
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
            <div className="grid gap-4">
                {JOBS.map((job, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={job.id}
                        className="group bg-cardGlass rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col md:flex-row gap-6 glass-panel"
                    >
                        {/* Logo */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 shadow-sm ${job.color}`}>
                            {job.logo}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4" /> {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4" /> {job.type}
                                        </span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-50 text-emerald-700 shadow-sm">
                                    92% Match
                                </span>
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                {job.description}
                            </p>
                        </div>

                        {/* Action */}
                        <div className="flex items-center md:self-center">
                            <Button variant="ghost" className="group/btn text-primary hover:bg-primary/5">
                                View Details
                                <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-8">
                <Button variant="ghost" className="text-muted-foreground">Load More Jobs</Button>
            </div>
        </div>
    );
};

export default JobDescriptions;
