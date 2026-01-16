import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getAnalysisHistory } from '../api/analysis';
import { useAuth } from '../context/AuthContext';

const History: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<{ id: number; score: number; created_at: string; feedback: string }[]>([]);

  useEffect(() => {
    if (user?.id) {
      getAnalysisHistory(user.id).then(setHistory).catch(console.error);
    }
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Review your past CV optimizations and track your progress.</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {history.length === 0 ? (
          <div className="text-center text-[hsl(var(--muted-foreground))] py-12">
            No past analyses found.
          </div>
        ) : (
          history.map((entry: any) => (
            <motion.div key={entry.id} variants={item}>
              <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:border-[hsl(var(--primary)/0.5)] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${entry.score >= 80 ? 'bg-green-500/10 text-green-500' :
                    entry.score >= 50 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                    {entry.score}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Analysis #{entry.id}
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] truncate max-w-md">
                      {entry.feedback && entry.feedback.slice(0, 100)}...
                    </p>
                  </div>
                </div>

                <Button variant="ghost" className="shrink-0">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default History;
