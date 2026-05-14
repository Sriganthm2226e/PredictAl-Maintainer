import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  BarChart3, Brain, Smile, AlertTriangle, HelpCircle, Activity, 
  TrendingUp, RefreshCw 
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = "http://localhost:5000/api/v1";
const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Positive, Negative, Neutral

const SentimentPage = () => {
  const [token, setToken] = useState(localStorage.getItem("brand_senti_token"));
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch Stats
  const fetchStats = async () => {
    if (!token || !selectedBrand) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_BASE}/mentions/stats?brand_id=${selectedBrand.id}&days=30`, config);
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch stats", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token, selectedBrand]);

  const total = stats?.total_mentions || 0;
  const posVal = stats?.sentiment_distribution?.positive || 0;
  const negVal = stats?.sentiment_distribution?.negative || 0;
  const neuVal = stats?.sentiment_distribution?.neutral || 0;

  const posPerc = total ? ((posVal / total) * 100).toFixed(1) : "0.0";
  const negPerc = total ? ((negVal / total) * 100).toFixed(1) : "0.0";
  const neuPerc = total ? ((neuVal / total) * 100).toFixed(1) : "0.0";

  const pieData = [
    { name: 'Positive', value: posVal, color: '#10b981' },
    { name: 'Negative', value: negVal, color: '#ef4444' },
    { name: 'Neutral', value: neuVal, color: '#f59e0b' }
  ];

  const defaultTrendData = [
    { date: 'May 10', positive: 50, negative: 10, neutral: 20, mentions: 80 },
    { date: 'May 15', positive: 70, negative: 15, neutral: 25, mentions: 110 },
    { date: 'May 20', positive: 65, negative: 20, neutral: 30, mentions: 115 },
    { date: 'May 25', positive: 85, negative: 12, neutral: 28, mentions: 125 },
    { date: 'May 30', positive: 90, negative: 18, neutral: 35, mentions: 143 }
  ];

  const trendData = stats?.trends?.length ? stats.trends : defaultTrendData;

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            AI SENTIMENT STUDIO
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Deep-listening natural language sentiment parsing and brand health audits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
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
              {brands.map(b => (
                <option key={b.id} value={b.id} className="bg-[#0f1115] text-white">{b.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchStats}
            className="p-2.5 bg-[#0f1115] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Stats</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-white flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-xs tracking-wider">HARVESTING SENTIMENT MATRICES...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0f1115] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Positivity Ratio</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{posPerc}%</p>
                <p className="text-[9px] text-slate-600 mt-0.5">Ratio of supportive terms</p>
              </div>
            </div>

            <div className="bg-[#0f1115] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">AI Confidence Index</p>
                <p className="text-xl font-bold text-purple-400 mt-0.5">
                  {stats?.averages?.confidence ? `${(stats.averages.confidence * 100).toFixed(0)}%` : "91%"}
                </p>
                <p className="text-[9px] text-slate-600 mt-0.5">Neural model classification strength</p>
              </div>
            </div>

            <div className="bg-[#0f1115] border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Crisis Toxicity Rate</p>
                <p className="text-xl font-bold text-red-400 mt-0.5">
                  {stats?.averages?.toxicity ? `${(stats.averages.toxicity * 100).toFixed(0)}%` : "12%"}
                </p>
                <p className="text-[9px] text-slate-600 mt-0.5">Severe negativity detection threshold</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Sentiment Over Time */}
            <div className="xl:col-span-2 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Sentiment History</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Visualizing timelines of positive vs negative spikes</p>
                </div>
                <div className="bg-[#050505] border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-400 font-medium font-mono">
                  30 Day Window
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#16181d" vertical={false} />
                    <XAxis dataKey="date" stroke="#334155" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#334155" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#posGrad)" strokeWidth={2} name="Positive" />
                    <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#negGrad)" strokeWidth={2} name="Negative" />
                    <Area type="monotone" dataKey="neutral" stroke="#f59e0b" fill="none" strokeWidth={1.5} name="Neutral" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Sentiment Allocation</h3>
                <p className="text-[10px] text-slate-500 mb-6">Percentage allotment of categorized posts</p>
              </div>

              <div className="h-44 relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.some(p => p.value > 0) ? pieData : [
                        { name: 'Positive', value: 1, color: '#10b981' },
                        { name: 'Negative', value: 0, color: '#ef4444' },
                        { name: 'Neutral', value: 0, color: '#f59e0b' }
                      ]}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-xl font-bold text-white">{total}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Total</p>
                </div>
              </div>

              <div className="space-y-2.5 mt-6 border-t border-slate-900 pt-4">
                <LegendRow color="#10b981" label="Positive Mentions" pct={`${posPerc}%`} count={`(${posVal})`} />
                <LegendRow color="#ef4444" label="Negative Complaints" pct={`${negPerc}%`} count={`(${negVal})`} />
                <LegendRow color="#f59e0b" label="Neutral Commentary" pct={`${neuPerc}%`} count={`(${neuVal})`} />
              </div>
            </div>
          </div>

          {/* Emotion Distribution Panel */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Dynamic Emotion Spectrum Classification
            </h3>
            <p className="text-[10px] text-slate-500 mb-6">Categorizing post content semantic intentions into human psychological domains</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats?.emotion_distribution && Object.keys(stats.emotion_distribution).length > 0 ? (
                Object.entries(stats.emotion_distribution).map(([emotion, count]) => {
                  const perc = total ? ((count / total) * 100).toFixed(0) : "0";
                  return (
                    <div key={emotion} className="bg-[#050505] border border-slate-900 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-400 capitalize font-extrabold">{emotion}</span>
                        <span className="text-[10px] text-indigo-400 font-bold">{perc}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-indigo-500" style={{ width: `${perc}%` }}></div>
                      </div>
                      <span className="text-[9px] text-slate-600 block mt-1.5">{count} total mentions</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <StaticEmotionCard emotion="Joy 😃" count="12 mentions" percentage="63%" color="bg-emerald-500" />
                  <StaticEmotionCard emotion="Surprise 😲" count="4 mentions" percentage="21%" color="bg-blue-500" />
                  <StaticEmotionCard emotion="Anger 😡" count="2 mentions" percentage="11%" color="bg-red-500" />
                  <StaticEmotionCard emotion="Sadness 😢" count="1 mentions" percentage="5%" color="bg-amber-500" />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const LegendRow = ({ color, label, pct, count }) => (
  <div className="flex items-center justify-between text-[11px]">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-slate-400 font-semibold">{label}</span>
    </div>
    <div className="flex gap-2">
      <span className="text-white font-extrabold">{pct}</span>
      <span className="text-slate-600">{count}</span>
    </div>
  </div>
);

const StaticEmotionCard = ({ emotion, count, percentage, color }) => (
  <div className="bg-[#050505] border border-slate-900 p-4 rounded-xl">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-slate-400 font-extrabold">{emotion}</span>
      <span className="text-[10px] text-slate-400 font-bold">{percentage}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
      <div className={`h-full ${color}`} style={{ width: percentage }}></div>
    </div>
    <span className="text-[9px] text-slate-600 block mt-1.5">{count}</span>
  </div>
);

export default SentimentPage;
