import React, { useState } from 'react';
import { 
  Users, Sparkles, UserCheck, UserX, UserPlus, Heart, 
  MessageCircle, BarChart3, TrendingUp, Search, Mail, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InfluencersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const influencers = [
    {
      id: 1,
      name: "Marcus Aurelius",
      handle: "@marcus_style",
      platform: "Instagram",
      followers: "1.2M",
      engagement: "5.4%",
      sentCorrelation: "92% Positive",
      status: "Advocate",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Aurelius&background=6366f1&color=fff",
      desc: "Top luxury menswear curator. Frequently shares minimal blazers and quiet luxury fits that net huge comments and high sentiment alignment."
    },
    {
      id: 2,
      name: "Aria Thorne",
      handle: "@ariathorne",
      platform: "TikTok",
      followers: "850K",
      engagement: "8.1%",
      sentCorrelation: "88% Positive",
      status: "Advocate",
      avatar: "https://ui-avatars.com/api/?name=Aria+Thorne&background=10b981&color=fff",
      desc: "Streetwear aesthetic content creator. Her techwear fit reviews have driven high-urgency traffic and positive conversions for outer-shell fashion items."
    },
    {
      id: 3,
      name: "David Chen",
      handle: "@dchen_tech",
      platform: "Twitter/X",
      followers: "420K",
      engagement: "3.2%",
      sentCorrelation: "62% Neutral",
      status: "Skeptic",
      avatar: "https://ui-avatars.com/api/?name=David+Chen&background=f59e0b&color=fff",
      desc: "Silicon Valley product designer. Discusses wearable ergonomics and fabric durability with highly critical, analytical perspectives."
    },
    {
      id: 4,
      name: "Samantha Wright",
      handle: "@samanthafit",
      platform: "YouTube",
      followers: "2.4M",
      engagement: "4.7%",
      sentCorrelation: "41% Negative",
      status: "Risk Factor",
      avatar: "https://ui-avatars.com/api/?name=Samantha+Wright&background=ef4444&color=fff",
      desc: "High-reach fitness creator. Released a vlog complaining about fast fashion fabric pilling, generating severe secondary negative comments."
    }
  ];

  const filteredInfluencers = influencers.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Advocate') return matchesSearch && i.status === 'Advocate';
    if (activeTab === 'Skeptic') return matchesSearch && i.status === 'Skeptic';
    if (activeTab === 'Risk') return matchesSearch && i.status === 'Risk Factor';
    return matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-emerald-500" />
            AI ADVOCATES & INFLUENCERS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tracking Key Opinion Leaders (KOLs) and advocates who drive brand volume and sentiment shifts
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search influencer names..."
              className="bg-[#0f1115] border border-slate-800 focus:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all w-60"
            />
          </div>
        </div>
      </div>

      {/* Tabs Filter Row */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-900/60 pb-4">
        {['All', 'Advocate', 'Skeptic', 'Risk'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === tab
                ? tab === 'Advocate' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' :
                  tab === 'Risk' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' :
                  tab === 'Skeptic' ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20' :
                  'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                : 'bg-[#0f1115] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {tab === 'Risk' ? 'Risk Factors' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Grid of Influencer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AnimatePresence>
          {filteredInfluencers.map((inf, idx) => (
            <motion.div
              key={inf.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="bg-[#0f1115] border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 relative overflow-hidden group transition-all flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-2xl border border-slate-800" />
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{inf.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{inf.handle} · <span className="text-indigo-400 font-bold">{inf.platform}</span></p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded border tracking-wider ${
                    inf.status === 'Advocate' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    inf.status === 'Skeptic' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-red-400 bg-red-500/10 border-red-500/20'
                  }`}>
                    {inf.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                  {inf.desc}
                </p>
              </div>

              {/* Stats and Action Row */}
              <div className="border-t border-slate-900 pt-4 mt-auto">
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-[#050505] p-2.5 rounded-xl border border-slate-900">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Followers</p>
                    <p className="text-xs font-black text-white mt-1">{inf.followers}</p>
                  </div>
                  <div className="bg-[#050505] p-2.5 rounded-xl border border-slate-900">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Engagement</p>
                    <p className="text-xs font-black text-indigo-400 mt-1">{inf.engagement}</p>
                  </div>
                  <div className="bg-[#050505] p-2.5 rounded-xl border border-slate-900">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Correlation</p>
                    <p className={`text-xs font-black mt-1 ${
                      inf.sentCorrelation.includes('Positive') ? 'text-emerald-400' :
                      inf.sentCorrelation.includes('Negative') ? 'text-red-400' : 'text-amber-400'
                    }`}>{inf.sentCorrelation.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-[#050505] hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <Mail className="w-3.5 h-3.5" /> Email Advocate
                  </button>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer">
                    <ExternalLink className="w-3.5 h-3.5" /> Track Feed
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Campaign Strategy Card */}
      <div className="bg-gradient-to-r from-emerald-950/10 via-[#0f1115] to-[#0f1115] border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-400 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">AI Marketing Advocacy Strategy</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Our models recommend prioritizing outreach to <strong>Marcus Aurelius</strong> for high-end capsule campaign drops. 
              Simultaneously, setup a direct feedback thread with <strong>Samantha Wright</strong> to address quality assurance 
              complaints and mitigate downstream brand risk spikes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencersPage;
