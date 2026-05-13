import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, Search, Eye, Filter, Sparkles, RefreshCw, 
  ChevronDown, ArrowUpRight, ShieldAlert, Heart 
} from 'lucide-react';
import Header from '../components/Header.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http://127.0.0.1:8000/api/v1";

const MentionsPage = () => {
  const [token, setToken] = useState(localStorage.getItem("brand_senti_token"));
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [activePlatform, setActivePlatform] = useState('All');
  const [activeSentiment, setActiveSentiment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Self-bootstrap authentication if token is missing
  useEffect(() => {
    if (token) return;
    const bootstrapAuth = async () => {
      const email = "demo@predictai.com";
      const password = "demoPassword123";
      try {
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);
        const loginRes = await axios.post(`${API_BASE}/auth/login`, form);
        const accessToken = loginRes.data.access_token;
        localStorage.setItem("brand_senti_token", accessToken);
        setToken(accessToken);
      } catch (err) {
        console.error("Auth bootstrap failed", err);
      }
    };
    bootstrapAuth();
  }, [token]);

  // Fetch Brands
  useEffect(() => {
    if (!token) return;
    const fetchBrands = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE}/brands/`, config);
        setBrands(res.data);
        if (res.data.length > 0) {
          setSelectedBrand(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("brand_senti_token");
          setToken(null);
        }
      }
    };
    fetchBrands();
  }, [token]);

  // Fetch Mentions on selected brand, active platform, or active sentiment change
  const fetchMentions = async () => {
    if (!token || !selectedBrand) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = `${API_BASE}/mentions/?brand_id=${selectedBrand.id}&limit=100`;
      
      if (activePlatform !== 'All') {
        url += `&source=${activePlatform.toLowerCase()}`;
      }
      if (activeSentiment !== 'All') {
        url += `&sentiment=${activeSentiment.toLowerCase()}`;
      }

      const res = await axios.get(url, config);
      setMentions(res.data.mentions || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch mentions", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentions();
  }, [token, selectedBrand, activePlatform, activeSentiment]);

  const getSentimentStyle = (s) => {
    const sentiment = s?.toLowerCase();
    if (sentiment === 'positive') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (sentiment === 'negative') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  // Local Search Filter
  const filteredMentions = mentions.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            LIVE MENTIONS FEED
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time ingested and AI-analyzed streams across social web domains
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Brand Switcher */}
          <div className="flex items-center gap-2 bg-[#0f1115] border border-slate-800 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 font-medium">Tracking:</span>
            <select
              value={selectedBrand?.id || ""}
              onChange={(e) => {
                const b = brands.find(item => item.id === parseInt(e.target.value));
                if (b) setSelectedBrand(b);
              }}
              className="bg-transparent text-xs text-blue-400 font-bold focus:outline-none cursor-pointer"
            >
              {brands.length === 0 && <option value="">Loading keyword...</option>}
              {brands.map(b => (
                <option key={b.id} value={b.id} className="bg-[#0f1115] text-white">{b.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchMentions}
            className="p-2.5 bg-[#0f1115] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        {/* Search Bar */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching content terms..."
            className="w-full bg-[#0f1115] border border-slate-800 focus:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none transition-all"
          />
        </div>

        {/* Platform Sources Filter */}
        <div className="lg:col-span-5 flex flex-wrap gap-2">
          {['All', 'Twitter', 'Reddit', 'News'].map(platform => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                activePlatform === platform
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                  : 'bg-[#0f1115] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Sentiment Category Filter */}
        <div className="lg:col-span-3 flex justify-end gap-2">
          {['All', 'Positive', 'Negative', 'Neutral'].map(sentiment => (
            <button
              key={sentiment}
              onClick={() => setActiveSentiment(sentiment)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                activeSentiment === sentiment
                  ? sentiment === 'Positive' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' :
                    sentiment === 'Negative' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' :
                    sentiment === 'Neutral' ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20' :
                    'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                  : 'bg-[#0f1115] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {sentiment}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed List Content */}
      {loading ? (
        <div className="p-20 text-white flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-xs tracking-wider">LOADING SECURE BRAND STREAMS...</p>
        </div>
      ) : filteredMentions.length === 0 ? (
        <div className="bg-[#0f1115] border border-slate-800/80 rounded-3xl p-16 text-center">
          <div className="w-12 h-12 bg-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-800 mx-auto mb-4">
            <Filter className="w-6 h-6 text-slate-600" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">No mentions matched filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try switching the keyword brand, changing platform filters, or generating new live sandbox mentions at the main dashboard console!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredMentions.map((m, index) => (
              <motion.div
                key={m.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                className="group bg-[#0f1115] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all relative overflow-hidden"
              >
                {/* Sentiment Edge Accent */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  m.sentiment?.sentiment === 'positive' ? 'bg-emerald-500' :
                  m.sentiment?.sentiment === 'negative' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#050505] border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400 uppercase tracking-tight">
                      {m.source.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white flex items-center gap-2">
                        <span>@{m.source}_streamer</span>
                        <span className="text-[10px] text-slate-600 font-medium">·</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">
                          {m.source} source
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(m.posted_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  {/* Badges / Metrics Row */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    {/* Sentiment Badge */}
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${getSentimentStyle(m.sentiment?.sentiment)}`}>
                      {m.sentiment?.sentiment}
                    </span>

                    {/* Emotion Tag */}
                    {m.sentiment?.emotion && (
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded uppercase">
                        🎭 {m.sentiment?.emotion}
                      </span>
                    )}

                    {/* Toxicity Alert Trigger */}
                    {(m.sentiment?.toxicity || 0) > 0.6 && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                        <ShieldAlert className="w-3.5 h-3.5" /> TOXIC
                      </span>
                    )}
                  </div>
                </div>

                {/* Mention Content */}
                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors mb-4">
                  {m.content}
                </p>

                {/* Footer Metrics */}
                <div className="flex flex-wrap justify-between items-center border-t border-slate-900 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>AI Confidence: <strong className="text-white">{(m.sentiment?.confidence * 100).toFixed(0)}%</strong></span>
                    <span className="text-slate-800">|</span>
                    <span>Toxicity Score: <strong className="text-white">{((m.sentiment?.toxicity || 0) * 100).toFixed(0)}%</strong></span>
                    <span className="text-slate-800">|</span>
                    <span>Urgency Level: <strong className="text-white">{((m.sentiment?.urgency || 0) * 100).toFixed(0)}%</strong></span>
                  </div>

                  {m.url && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 flex items-center gap-1 font-bold no-underline group/link transition-colors"
                    >
                      <span>Inspect Source Link</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MentionsPage;
