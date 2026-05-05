import Header from '../components/Header.jsx';
import { MessageCircle, TrendingUp, AlertCircle, Share2, ChevronDown } from 'lucide-react';

const MentionsPage = () => {
  const mentions = [
    { id: 1, user: "@sarahjohnson", platform: "Twitter", content: "Love the new #CocaCola Zero Sugar! Best taste ever ❤️", sentiment: "Positive", time: "2m ago", engagement: 1240 },
    { id: 2, user: "@foodie_lover", platform: "Instagram", content: "Just had a Coke and it was amazing! #TasteTheFeeling", sentiment: "Positive", time: "5m ago", engagement: 890 },
    { id: 3, user: "@rohit_kumar", platform: "X", content: "Why is #CocaCola so overpriced now? 😡", sentiment: "Negative", time: "15m ago", engagement: 2100 },
    { id: 4, user: "@just_an_user", platform: "Reddit", content: "Coca-Cola's new campaign is brilliant! 👏", sentiment: "Positive", time: "30m ago", engagement: 560 },
    { id: 5, user: "@tech_guru", platform: "LinkedIn", content: "Coca-Cola's marketing strategy is a masterclass in brand building.", sentiment: "Positive", time: "1h ago", engagement: 3200 },
    { id: 6, user: "@angry_customer", platform: "Twitter", content: "Terrible experience with @CocaCola customer service today.", sentiment: "Negative", time: "2h ago", engagement: 450 },
    { id: 7, user: "@neutral_observer", platform: "Reddit", content: "Coca-Cola just announced a new flavor. Nothing special.", sentiment: "Neutral", time: "3h ago", engagement: 120 },
    { id: 8, user: "@fitness_fan", platform: "Instagram", content: "Switched from soda to water. Sorry Coke!", sentiment: "Negative", time: "4h ago", engagement: 670 },
  ];

  const getSentimentColor = (s) => {
    if (s === 'Positive') return 'text-emerald-500 bg-emerald-500/10';
    if (s === 'Negative') return 'text-red-500 bg-red-500/10';
    return 'text-amber-500 bg-amber-500/10';
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <Header title="Mentions" subtitle="All brand mentions across social platforms" />

      <div className="flex flex-wrap gap-3 mb-8">
        {["All", "Twitter", "Instagram", "X", "Reddit", "LinkedIn"].map(p => (
          <button key={p} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${p === 'All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'}`}>
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mentions.map(m => (
          <div key={m.id} className="bg-[#0f1115] border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                  {m.user.charAt(1).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{m.user}</p>
                  <p className="text-[10px] text-slate-500">{m.platform} · {m.time}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getSentimentColor(m.sentiment)}`}>
                {m.sentiment}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3 group-hover:text-slate-300 transition-colors">{m.content}</p>
            <div className="flex items-center gap-4 text-[10px] text-slate-600">
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {m.engagement.toLocaleString()} engagements</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentionsPage;
