import Header from '../components/Header.jsx';
import { Download, FileText, Calendar } from 'lucide-react';

const ReportsPage = () => {
  const reports = [
    { id: 1, title: "Monthly Brand Health Report", date: "Jun 2024", type: "PDF", size: "2.4 MB", status: "Ready" },
    { id: 2, title: "Competitor Analysis Q2", date: "Jun 2024", type: "PDF", size: "3.1 MB", status: "Ready" },
    { id: 3, title: "Sentiment Trend Report", date: "May 2024", type: "CSV", size: "1.8 MB", status: "Ready" },
    { id: 4, title: "Social Listening Summary", date: "May 2024", type: "PDF", size: "4.2 MB", status: "Ready" },
    { id: 5, title: "Influencer Impact Report", date: "Apr 2024", type: "PDF", size: "2.9 MB", status: "Ready" },
    { id: 6, title: "Weekly Digest - Week 24", date: "Jun 2024", type: "PDF", size: "1.1 MB", status: "Generating..." },
  ];

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <Header title="Reports" subtitle="Download and manage your brand analytics reports" />

      <div className="flex justify-end mb-8">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-600/20">
          <FileText className="w-4 h-4" /> Generate New Report
        </button>
      </div>

      <div className="bg-[#0f1115] border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
              <th className="px-6 py-4 font-bold">Report</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">Size</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-xs font-bold text-white">{r.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{r.date}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">{r.type}</span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{r.size}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold ${r.status === 'Ready' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>{r.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className={`p-2 rounded-lg transition-all ${r.status === 'Ready' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 text-slate-600 cursor-not-allowed'}`} disabled={r.status !== 'Ready'}>
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
