import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Upload, History as HistoryIcon, LogOut, Menu, X } from 'lucide-react';
import Button from './ui/Button';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        navigate("/");
    };

    // This line was syntactically incorrect in the provided snippet.
    // Assuming it was meant to define a type or a state variable for recentActivity,
    // but it's not directly used in the current `NavContent` logic for rendering.
    // If `recentActivity` was intended to be part of `NavContent`, its usage would need to be integrated.
    // For now, I'll keep the `navItems` as they are, as the `NavLink` mapping still refers to `item.path`.
    // If `stats.recentActivity.map` was intended to replace `navItems.map`, the `NavLink` structure would need adjustment.
    // Given the instruction "fix 'any' types" and the snippet, I'm defining the type for `RecentActivityItem`
    // and assuming `recentActivity` might be used elsewhere or in a future change.
    // The snippet `recentActivity: [] as { id: number; score: number; created_at: string }[]`
    // is not a valid statement outside of a variable declaration or type definition.

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/upload', label: 'Analyze CV', icon: Upload },
        { path: '/jobs', label: 'Job Descriptions', icon: FileText },
        { path: '/history', label: 'History', icon: HistoryIcon },
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))] to-purple-400 flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <FileText className="text-white h-6 w-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">CV Analyzer</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {/* The snippet suggested `stats.recentActivity.map`, but `stats` is not defined here.
                    Also, the `NavLink` structure still refers to `item.path`.
                    Assuming the intention was to keep the existing navigation items for now,
                    or that `stats.recentActivity` would be used in a different context.
                    If the navigation was meant to be dynamic based on `recentActivity`,
                    the `NavLink` props would need to be adjusted accordingly (e.g., `key = { activity.id }`, `to = {/ history / ${ activity.id }}`).
                    For now, I'm retaining the original `navItems.map` as it's syntactically correct and functional
                    with the existing `NavLink` structure.
                */}
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items - center gap - 3 px - 4 py - 3 rounded - xl transition - all duration - 200 ${isActive
                                ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] font-medium'
                                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.05)] hover:text-[hsl(var(--foreground))]'
                            } `
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-[hsl(var(--border))]">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)]"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-transparent">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r border-[hsl(var(--border))] glass-panel fixed h-full z-40 rounded-none border-t-0 border-b-0 border-l-0">
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-panel z-40 flex items-center justify-between px-4 border-b border-[hsl(var(--border))] rounded-none">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[hsl(var(--primary))] to-purple-400 flex items-center justify-center">
                        <FileText className="text-white h-4 w-4" />
                    </div>
                    <span className="font-bold">CV Analyzer</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden fixed inset-0 z-30 pt-16 bg-[hsl(var(--background))]"
                >
                    <NavContent />
                </motion.div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen w-full">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
