import React from 'react';
import { Search, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import Button from '../components/ui/Button';

const History: React.FC = () => {
  const historyItems = [
    { id: 1, name: "Product_Manager_Resume_v2.pdf", date: "Oct 24, 2024", score: 85, improve: "+12%" },
    { id: 2, name: "Product_Manager_Global.pdf", date: "Oct 22, 2024", score: 73, improve: null },
    { id: 3, name: "John_Doe_CV_2024.pdf", date: "Sep 15, 2024", score: 68, improve: "-2%" },
    { id: 4, name: "Draft_Resume_Tech.pdf", date: "Aug 30, 2024", score: 92, improve: "+4%" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analysis History</h1>
          <p className="text-muted-foreground mt-1">Track your resume improvements over time.</p>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-border shadow-sm max-w-2xl">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <input
          type="text"
          placeholder="Search past analyses..."
          className="flex-1 outline-none text-sm"
        />
        <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* History Table/List */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 bg-slate-50/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Date Analyzed</th>
              <th className="px-6 py-4">ATS Score</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {historyItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{item.date}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {item.date}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`
                                            px-2.5 py-1 rounded-full text-xs font-bold
                                            ${item.score >= 80 ? 'bg-green-100 text-green-700' :
                        item.score >= 60 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}
                                        `}>
                      {item.score}
                    </span>
                    {item.improve && (
                      <span className={`text-xs font-medium ${item.improve.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                        {item.improve}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    View Report <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
