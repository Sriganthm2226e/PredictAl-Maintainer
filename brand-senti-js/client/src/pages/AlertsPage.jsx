import Header from '../components/Header.jsx';
import { TrendingUp, MessageCircle, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const AlertsPage = () => {
  const alerts = [
    { id: 1, type: "critical", title: "Negative sentiment spike", desc: "Negative mentions increased by 15.7% in the last 24 hours.", time: "2m ago", icon: <TrendingUp className="w-4 h-4 text-red-500" /> },
    { id: 2, type: "warning", title: "High mention volume", desc: "Mention volume is higher than usual in the last 1 hour.", time: "15m ago", icon: <MessageCircle className="w-4 h-4 text-amber-500" /> },
    { id: 3, type: "info", title: "New viral mention", desc: "Your brand was mentioned in a viral post with 10k+ engagement.", time: "1h ago", icon: <Share2 className="w-4 h-4 text-blue-500" /> },
    { id: 4, type: "critical", title: "Competitor surge", desc: "Pepsi mentions increased by 25% — potential campaign launch detected.", time: "2h ago", icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
    { id: 5, type: "resolved", title: "Sentiment recovered", desc: "Positive sentiment is back above 50% after yesterday's dip.", time: "5h ago", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { id: 6, type: "warning", title: "Low engagement rate", desc: "Engagement rate dropped below average for 3 consecutive hours.", time: "6h ago", icon: <TrendingUp className="w-4 h-4 text-amber-500" /> },
  ];

  const getBorderColor = (type) => {
    if (type === 'critical') return 'border-l-red-500';
    if (type === 'warning') return 'border-l-amber-500';
    if (type === 'resolved') return 'border-l-emerald-500';
    return 'border-l-blue-500';
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <Header title="Alerts" subtitle="Real-time notifications and alert management" />

      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { label: "All Alerts", count: 6, active: true },
          { label: "Critical", count: 2 },
          { label: "Warning", count: 2 },
          { label: "Info", count: 1 },
          { label: "Resolved", count: 1 },
        ].map((tab) => (
          <button key={tab.label} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${tab.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'}`}>
            {tab.label}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${tab.active ? 'bg-white/20' : 'bg-slate-800'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {alerts.map(a => (
          <div key={a.id} className={`bg-[#0f1115] border border-slate-800 border-l-4 ${getBorderColor(a.type)} p-5 rounded-2xl hover:border-slate-700 transition-all group`}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 p-2 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0">
                {a.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  <span className="text-[10px] text-slate-600 flex-shrink-0">{a.time}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
