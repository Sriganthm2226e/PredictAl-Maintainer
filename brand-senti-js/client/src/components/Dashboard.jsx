import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Search, Bell, Plus, Download, Calendar, ChevronDown, Menu, Users,
  MessageCircle, TrendingUp, TrendingDown, AlertCircle, Share2, Eye, Activity, Terminal, ShieldAlert
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { socket, subscribeToBrand, unsubscribeFromBrand } from '../services/socket';

const API_BASE = "http://127.0.0.1:8000/api/v1";
const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Positive, Negative, Neutral

const Dashboard = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentMentions, setRecentMentions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("brand_senti_token"));
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDesc, setNewBrandDesc] = useState("");

  // Developer Testing States
  const [wsConnected, setWsConnected] = useState(false);
  const [latency, setLatency] = useState(0);
  const [redisHealth, setRedisHealth] = useState("checking...");
  const [injecting, setInjecting] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(true);

  // Step 1: Self-bootstrap authentication with a default developer/demo account
  useEffect(() => {
    const bootstrapAuth = async () => {
      // If we already have a saved token, no need to re-auth immediately unless it fails
      if (token) return;

      const email = "demo@predictai.com";
      const password = "demoPassword123";
      
      try {
        // Attempt login
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);
        const loginRes = await axios.post(`${API_BASE}/auth/login`, form);
        const accessToken = loginRes.data.access_token;
        localStorage.setItem("brand_senti_token", accessToken);
        setToken(accessToken);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            // Register if user doesn't exist
            const regRes = await axios.post(`${API_BASE}/auth/register`, {
              email,
              password,
              full_name: "Demo Account"
            });
            const accessToken = regRes.data.access_token;
            localStorage.setItem("brand_senti_token", accessToken);
            setToken(accessToken);
          } catch (regErr) {
            console.error("Auth registration bootstrap failed", regErr);
          }
        } else {
          console.error("Auth login bootstrap failed", err);
        }
      }
    };
    bootstrapAuth();
  }, [token]);

  // Step 2: Fetch user's brands once authenticated
  useEffect(() => {
    if (!token) return;

    const fetchBrands = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE}/brands/`, config);
        
        if (res.data.length === 0) {
          // Auto-create a default brand so the dashboard is immediately ready
          const defaultBrand = await axios.post(`${API_BASE}/brands/`, {
            name: "Tesla",
            description: "Automotive and Energy Company"
          }, config);
          setBrands([defaultBrand.data]);
          setSelectedBrand(defaultBrand.data);
        } else {
          setBrands(res.data);
          setSelectedBrand(res.data[0]); // Select first brand by default
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

  // Step 3: Fetch Stats & Recent Mentions for selected brand
  const loadBrandData = async (brandId) => {
    if (!token || !brandId) return;
    setLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch dynamic live metrics & stats from backend
      const statsRes = await axios.get(`${API_BASE}/mentions/stats?brand_id=${brandId}`, config);
      setStats(statsRes.data);
      
      // Fetch latest mentions
      const mentionsRes = await axios.get(`${API_BASE}/mentions/?brand_id=${brandId}`, config);
      setRecentMentions(mentionsRes.data.mentions || []);
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading brand statistics", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBrand) {
      loadBrandData(selectedBrand.id);
    }
  }, [selectedBrand, token]);

  // Step 4: Hook up real-time Socket.IO subscriptions
  useEffect(() => {
    if (!selectedBrand) return;

    // Connect to websocket room for this brand
    subscribeToBrand(selectedBrand.id);

    // Setup listener for live mentions
    const handleLiveMention = (mention) => {
      if (mention.brand_id === selectedBrand.id) {
        // Prepend new mention to feed
        setRecentMentions(prev => [mention, ...prev].slice(0, 50));
        
        // Update local stats counts in real-time
        setStats(prev => {
          if (!prev) return null;
          const sent = mention.sentiment.sentiment.toLowerCase();
          const dist = { ...prev.sentiment_distribution };
          if (sent in dist) {
            dist[sent] += 1;
          }
          return {
            ...prev,
            total_mentions: prev.total_mentions + 1,
            sentiment_distribution: dist
          };
        });
      }
    };

    // Setup listener for real-time safety alerts
    const handleViralSpike = (alertPayload) => {
      if (alertPayload.brand_id === selectedBrand.id) {
        setAlerts(prev => [alertPayload, ...prev].slice(0, 10));
      }
    };

    const handleNegativeAlert = (alertPayload) => {
      if (alertPayload.brand_id === selectedBrand.id) {
        setAlerts(prev => [alertPayload, ...prev].slice(0, 10));
      }
    };

    socket.on("live_mention", handleLiveMention);
    socket.on("viral_spike", handleViralSpike);
    socket.on("negative_alert", handleNegativeAlert);

    // Track Socket connectivity status
    setWsConnected(socket.connected);
    const onConnect = () => setWsConnected(true);
    const onDisconnect = () => setWsConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup subscription on unmount or brand change
    return () => {
      unsubscribeFromBrand(selectedBrand.id);
      socket.off("live_mention", handleLiveMention);
      socket.off("viral_spike", handleViralSpike);
      socket.off("negative_alert", handleNegativeAlert);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [selectedBrand]);

  // Step 5: Background monitors for testing panels (latency & Redis broker check)
  useEffect(() => {
    const fetchHealth = async () => {
      const start = Date.now();
      try {
        await axios.get(`${API_BASE}/health`);
        setLatency(Date.now() - start);
      } catch {
        setLatency(-1);
      }

      try {
        const res = await axios.get(`${API_BASE}/test/redis-health`);
        setRedisHealth(res.data.status === "healthy" ? "Active" : "Unreachable");
      } catch {
        setRedisHealth("Offline");
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim() || !token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_BASE}/brands/`, {
        name: newBrandName,
        description: newBrandDesc
      }, config);
      
      setBrands([...brands, res.data]);
      setSelectedBrand(res.data);
      setNewBrandName("");
      setNewBrandDesc("");
      setIsAddingBrand(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create brand");
    }
  };

  const triggerManualFetch = async () => {
    if (!selectedBrand || !token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_BASE}/brands/`, {
        name: selectedBrand.name,
        description: selectedBrand.description
      }, config);
      alert("Background fetch task triggered successfully! Loading new insights in a few seconds.");
      setTimeout(() => loadBrandData(selectedBrand.id), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Developer Injection API Handlers (REST calls to test WebSocket signals)
  const injectMention = async (sentiment, customParams = {}) => {
    if (!selectedBrand || !token || injecting) return;
    setInjecting(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = `${API_BASE}/test/inject?brand_id=${selectedBrand.id}&sentiment=${sentiment}`;
      
      if (customParams.toxicity) url += `&toxicity=${customParams.toxicity}`;
      if (customParams.urgency) url += `&urgency=${customParams.urgency}`;

      await axios.post(url, {}, config);
      setInjecting(false);
    } catch (err) {
      console.error("Injection failed", err);
      setInjecting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Authenticating Secure Platform Context...</p>
        </div>
      </div>
    );
  }

  // Display fields mappings using local state and backups
  const displayTotal = stats?.total_mentions || 0;
  const posVal = stats?.sentiment_distribution?.positive || 0;
  const negVal = stats?.sentiment_distribution?.negative || 0;
  const neuVal = stats?.sentiment_distribution?.neutral || 0;
  const posPerc = displayTotal ? ((posVal / displayTotal) * 100).toFixed(1) : "0.0";
  const negPerc = displayTotal ? ((negVal / displayTotal) * 100).toFixed(1) : "0.0";
  const neuPerc = displayTotal ? ((neuVal / displayTotal) * 100).toFixed(1) : "0.0";

  const sparkData = [
    { value: 400 }, { value: 600 }, { value: 500 }, { value: 800 }, { value: 650 }, { value: 900 }, { value: 1100 }
  ];

  const pieData = [
    { name: 'Positive', value: posVal, color: '#10b981' },
    { name: 'Negative', value: negVal, color: '#ef4444' },
    { name: 'Neutral', value: neuVal, color: '#f59e0b' }
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 bg-[#050505] min-h-screen overflow-x-hidden relative">
      {/* Real-time Push Alert Banner Overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-96 max-w-[calc(100vw-32px)]">
        <AnimatePresence>
          {alerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-4 rounded-xl border flex gap-3 shadow-2xl backdrop-blur-md ${
                alert.type === "viral_complaint" 
                  ? "bg-red-500/10 border-red-500/30 text-red-200" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-200"
              }`}
            >
              <div className="mt-1">
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                    {alert.type === "viral_complaint" ? "🔥 Crisis Warning" : "⚠ Sentiment Alert"}
                  </span>
                  <button 
                    onClick={() => setAlerts(prev => prev.filter((_, i) => i !== idx))} 
                    className="text-xs opacity-50 hover:opacity-100 text-white"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-white">{alert.message}</p>
                <span className="text-[9px] opacity-40 mt-1 block text-slate-400">Just now</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-white">Brand Monitor</h2>
            <div className="relative">
              <select 
                value={selectedBrand?.id || ""} 
                onChange={(e) => {
                  const b = brands.find(item => item.id === parseInt(e.target.value));
                  if (b) setSelectedBrand(b);
                }}
                className="bg-[#0f1115] text-xs text-blue-400 font-bold border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-slate-700 cursor-pointer"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setIsAddingBrand(true)}
              className="p-1.5 bg-[#0f1115] border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-500 text-sm">Real-time overview of brand mentions and AI-driven sentiment</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={triggerManualFetch}
            className="flex items-center gap-2 bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-2 text-xs text-blue-500 cursor-pointer hover:border-slate-700 hover:bg-slate-900 transition-all"
          >
            <TrendingUp className="w-4 h-4 animate-bounce" />
            <span>Trigger Real-time Scan</span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">Ankit Verma</p>
              <p className="text-[10px] text-slate-500">Admin</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=Ankit+Verma&background=random" className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
          </div>
        </div>
      </header>

      {/* Adding Brand Modal */}
      <AnimatePresence>
        {isAddingBrand && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f1115] border border-slate-800 rounded-2xl w-full max-w-md p-6"
            >
              <h3 className="text-base font-bold text-white mb-4">Track New Brand Keyword</h3>
              <form onSubmit={handleAddBrand} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Brand Name / Keyword</label>
                  <input 
                    type="text" 
                    value={newBrandName} 
                    onChange={(e) => setNewBrandName(e.target.value)}
                    required
                    placeholder="e.g. Nvidia, OpenAI, Apple"
                    className="w-full bg-[#050505] border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Description (Optional)</label>
                  <textarea 
                    value={newBrandDesc} 
                    onChange={(e) => setNewBrandDesc(e.target.value)}
                    placeholder="e.g. AI Hardware Producer"
                    className="w-full h-20 bg-[#050505] border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingBrand(false)}
                    className="px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs text-white font-bold transition-all"
                  >
                    Activate Brand Tracking
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="p-10 text-white flex flex-col items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-xs">Computing Sentiment Data Warehouse Matrix...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <KpiCard 
              title="Total Mentions" 
              value={displayTotal.toLocaleString()} 
              trend="+12.5%" 
              icon={<MessageCircle className="text-blue-500 w-5 h-5" />}
              sparkColor="#3b82f6"
              data={sparkData}
            />
            <KpiCard 
              title="Positive Mentions" 
              value={posVal.toLocaleString()} 
              trend={`${posPerc}%`} 
              icon={<TrendingUp className="text-emerald-500 w-5 h-5" />}
              sparkColor="#10b981"
              data={sparkData.map(d => ({ value: d.value * 0.8 }))}
            />
            <KpiCard 
              title="Negative Mentions" 
              value={negVal.toLocaleString()} 
              trend={`${negPerc}%`} 
              icon={<AlertCircle className="text-red-500 w-5 h-5" />}
              sparkColor="#ef4444"
              data={sparkData.map(d => ({ value: d.value * 0.4 }))}
              isNegativeTrend
            />
            <KpiCard 
              title="Neutral Mentions" 
              value={neuVal.toLocaleString()} 
              trend={`${neuPerc}%`} 
              icon={<Share2 className="text-amber-500 w-5 h-5" />}
              sparkColor="#f59e0b"
              data={sparkData.map(d => ({ value: d.value * 0.6 }))}
            />
            <div className="bg-[#0f1115] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Metrics Confidence</p>
                  <p className="text-xl font-bold text-white">{stats?.averages?.confidence ? `${(stats.averages.confidence * 100).toFixed(0)}%` : "91%"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-purple-400 font-bold">Reliability Index</span>
                <ResponsiveContainer width="40%" height={20}>
                  <LineChart data={sparkData}>
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Mentions Over Time */}
            <div className="xl:col-span-2 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Mentions Over Time</h3>
                <div className="bg-[#050505] border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-2">
                  <span className="text-[10px] text-white font-medium">Daily Trend</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.trends?.length ? stats.trends : [
                    { date: 'May 10', mentions: 1200 }, { date: 'May 15', mentions: 1900 }, { date: 'May 20', mentions: 1500 }, 
                    { date: 'May 25', mentions: 2100 }, { date: 'May 30', mentions: 1800 }, { date: 'Jun 5', mentions: 2800 }, { date: 'Jun 10', mentions: 2500 }
                  ]}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="mentions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-white mb-6">Sentiment Distribution</h3>
              <div className="h-64 relative flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.some(p => p.value > 0) ? pieData : [
                        { name: 'Positive', value: 50, color: '#10b981' },
                        { name: 'Negative', value: 20, color: '#ef4444' },
                        { name: 'Neutral', value: 30, color: '#f59e0b' }
                      ]}
                      innerRadius={65}
                      outerRadius={85}
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-bold text-white">{displayTotal}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total</p>
                </div>
                <div className="mt-4 space-y-2 w-full">
                   <LegendItem color="#10b981" label="Positive" percentage={`${posPerc}%`} count={`(${posVal})`} />
                   <LegendItem color="#ef4444" label="Negative" percentage={`${negPerc}%`} count={`(${negVal})`} />
                   <LegendItem color="#f59e0b" label="Neutral" percentage={`${neuPerc}%`} count={`(${neuVal})`} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Live Mentions Feed */}
            <div className="lg:col-span-2 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Mention Stream
                </h3>
              </div>
              
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {recentMentions.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-4 text-center">No brand mentions logged. Click 'Trigger Real-time Scan' to fetch live data!</p>
                  ) : (
                    recentMentions.map((mention) => (
                      <motion.div 
                        key={mention.id}
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className="group border-b border-slate-900 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-slate-300 capitalize">{mention.source} Feed</span>
                             <span className="text-[9px] text-slate-600">
                               {new Date(mention.posted_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                           </div>
                           <div className="flex items-center gap-1.5">
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                               mention.sentiment?.sentiment === 'positive' ? 'text-emerald-500 bg-emerald-500/10' :
                               mention.sentiment?.sentiment === 'negative' ? 'text-red-500 bg-red-500/10' :
                               'text-amber-500 bg-amber-500/10'
                             }`}>
                               {mention.sentiment?.sentiment}
                             </span>
                             {mention.sentiment?.emotion && (
                               <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded italic">
                                 {mention.sentiment.emotion}
                               </span>
                             )}
                           </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2 group-hover:text-slate-200 transition-colors">
                          {mention.content}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-600">
                          {mention.url && (
                            <a href={mention.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Source Link
                            </a>
                          )}
                          <div className="flex gap-3">
                            <span>Toxicity: {((mention.sentiment?.toxicity || 0) * 100).toFixed(0)}%</span>
                            <span>Urgency: {((mention.sentiment?.urgency || 0) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* AI Insights & Crisis Engine Status */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">AI Crisis Risk Index</h3>
                <div className="bg-[#050505] p-4 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Risk Intensity</span>
                    <span className={`text-xs font-bold ${
                      (stats?.averages?.toxicity || 0) > 0.5 ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {stats?.averages?.toxicity ? `${(stats.averages.toxicity * 100).toFixed(0)}%` : "14%"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        (stats?.averages?.toxicity || 0) > 0.5 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(stats?.averages?.toxicity || 0.14) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    {(stats?.averages?.toxicity || 0) > 0.5 
                      ? "ALERT: High toxicity metrics detected in negative mentions. Monitor channels closely." 
                      : "System secure. No viral complaints or PR crises have been triggered for this keyword."
                    }
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-4">Emotion Distribution</h3>
                <div className="space-y-3">
                  {stats?.emotion_distribution && Object.keys(stats.emotion_distribution).length > 0 ? (
                    Object.entries(stats.emotion_distribution).map(([emotion, count]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 capitalize">{emotion}</span>
                        <span className="text-xs text-white font-bold">{count} mentions</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <KeywordItem text="Joy" count="12 mentions" />
                      <KeywordItem text="Surprise" count="4 mentions" />
                      <KeywordItem text="Anger" count="2 mentions" />
                      <KeywordItem text="Sadness" count="1 mentions" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Developer Controls Sandbox (Floating or Collapsible Console Card) */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black tracking-wide text-white uppercase font-mono">Developer Testing Sandbox Console</h3>
              </div>
              <button 
                onClick={() => setIsSandboxOpen(!isSandboxOpen)}
                className="text-xs text-emerald-400 font-bold font-mono hover:underline"
              >
                [{isSandboxOpen ? "Hide Console" : "Show Console"}]
              </button>
            </div>

            <AnimatePresence>
              {isSandboxOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono text-xs"
                >
                  {/* Health Matrix Column */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-4 flex flex-col gap-4 text-slate-400">
                    <h4 className="font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" /> SYSTEM HEARTBEAT
                    </h4>
                    <div className="flex justify-between items-center">
                      <span>Socket WebSocket Port:</span>
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`}></span>
                        <span className={wsConnected ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
                          {wsConnected ? "CONNECTED" : "DISCONNECTED"}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Ping Response:</span>
                      <span className={latency >= 0 ? "text-slate-300 font-bold" : "text-red-500 font-bold"}>
                        {latency >= 0 ? `${latency} ms` : "TIMED OUT"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Redis Cache Status:</span>
                      <span className={redisHealth === "Active" ? "text-emerald-400 font-bold" : "text-red-500 font-bold"}>
                        {redisHealth.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* REST Injector Column */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-4 flex flex-col gap-3">
                    <h4 className="font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-blue-400" /> REST INGESTION INJECTORS
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Instantly inject custom dummy data to verify the REST API, Database persistence, and WS event broadcast.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={injecting}
                        onClick={() => injectMention("positive")}
                        className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 px-3 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all text-center"
                      >
                        + Inject Positive
                      </button>
                      <button 
                        disabled={injecting}
                        onClick={() => injectMention("neutral")}
                        className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-3 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all text-center"
                      >
                        + Inject Neutral
                      </button>
                    </div>
                    <button 
                      disabled={injecting}
                      onClick={() => injectMention("negative")}
                      className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-3 py-3 rounded-xl text-[10px] font-bold cursor-pointer transition-all text-center"
                    >
                      + Inject Negative Complaint
                    </button>
                  </div>

                  {/* Crisis Alerts Simulator Column */}
                  <div className="bg-[#050505] border border-slate-900 rounded-2xl p-4 flex flex-col gap-3">
                    <h4 className="font-bold text-white border-b border-slate-900 pb-2 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> ALERT SIMULATION
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Triggers severe scenarios to verify that the Smart Alert Engine detects PR crises and fires WebSocket overlays immediately.
                    </p>
                    <button 
                      disabled={injecting}
                      onClick={() => injectMention("negative", { toxicity: 0.95, urgency: 0.95 })}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-xl hover:shadow-lg transition-all cursor-pointer text-center text-[10px]"
                    >
                      ⚠️ SIMULATE VIRAL CRISIS SPIKE ⚠️
                    </button>
                    <p className="text-[9px] text-slate-600 text-center leading-normal">
                      Sends a tweet with 95% Toxicity & Urgency, prompting the Alert Engine to fire a global real-time overlay.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

const KpiCard = ({ title, value, trend, icon, sparkColor, data, isNegativeTrend }) => {
  return (
    <div className="bg-[#0f1115] border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
        <ResponsiveContainer width="40%" height={25}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={sparkColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className={`text-[10px] font-bold mt-1 ${isNegativeTrend ? 'text-red-500' : 'text-emerald-500'}`}>
          {trend} <span className="text-slate-600 font-normal">metric ratio</span>
        </p>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, percentage, count }) => (
  <div className="flex items-center justify-between text-[10px]">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-slate-500 font-medium">{label}</span>
    </div>
    <div className="flex gap-1.5">
      <span className="text-white font-bold">{percentage}</span>
      <span className="text-slate-600">{count}</span>
    </div>
  </div>
);

const KeywordItem = ({ text, count }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-medium text-slate-400 capitalize">{text}</span>
    <span className="text-xs font-bold text-white">{count}</span>
  </div>
);

export default Dashboard;
