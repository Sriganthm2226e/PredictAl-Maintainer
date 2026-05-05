import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Search, Bell, Plus, Download, Filter, MoreHorizontal, MessageCircle, 
  TrendingUp, TrendingDown, AlertCircle, Share2, Calendar, ChevronDown, Menu, Users
} from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/data');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to mock if API fails
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-white animate-pulse">Loading Analytics...</div>;

  // Use mock data if API didn't return anything or for extra fields
  const displayData = data || {
    total_mentions: 24532,
    positive_mentions: 12652,
    negative_mentions: 4895,
    neutral_mentions: 6985,
    engagement: 98765,
    kpi_trends: { mentions: "+12.5%", positive: "+8.3%", negative: "+15.7%", neutral: "-3.2%", engagement: "+18.4%" }
  };

  const sparkData = [
    { value: 400 }, { value: 600 }, { value: 500 }, { value: 800 }, { value: 650 }, { value: 900 }, { value: 1100 }
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 bg-[#050505] min-h-screen overflow-x-hidden">
      {/* Top Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <Menu className="w-5 h-5 text-slate-500 lg:hidden" />
          </div>
          <p className="text-slate-500 text-sm">Real-time overview of brand mentions and sentiment</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition-all">
            <Calendar className="w-4 h-4" />
            <span>May 10, 2024 - Jun 10, 2024</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#050505]">3</span>
            </div>
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Ankit Verma</p>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Ankit+Verma&background=random" className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      {/* Action Buttons Row */}
      <div className="flex justify-end gap-3 mb-8">
        <button className="flex items-center gap-2 bg-transparent border border-slate-800 hover:bg-white/5 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all">
          <Download className="w-4 h-4" /> Export Report
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard 
          title="Total Mentions" 
          value={displayData.total_mentions.toLocaleString()} 
          trend={displayData.kpi_trends.mentions} 
          icon={<MessageCircle className="text-blue-500" />}
          sparkColor="#3b82f6"
          data={sparkData}
        />
        <KpiCard 
          title="Positive Mentions" 
          value={displayData.positive_mentions.toLocaleString()} 
          trend={displayData.kpi_trends.positive} 
          icon={<TrendingUp className="text-emerald-500" />}
          sparkColor="#10b981"
          data={sparkData.map(d => ({ value: d.value * 0.8 }))}
        />
        <KpiCard 
          title="Negative Mentions" 
          value={displayData.negative_mentions.toLocaleString()} 
          trend={displayData.kpi_trends.negative} 
          icon={<AlertCircle className="text-red-500" />}
          sparkColor="#ef4444"
          data={sparkData.map(d => ({ value: d.value * 0.4 }))}
          isNegativeTrend
        />
        <KpiCard 
          title="Neutral Mentions" 
          value={displayData.neutral_mentions.toLocaleString()} 
          trend={displayData.kpi_trends.neutral} 
          icon={<Share2 className="text-amber-500" />}
          sparkColor="#f59e0b"
          data={sparkData.map(d => ({ value: d.value * 0.6 }))}
        />
        <div className="bg-[#0f1115] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Engagement</p>
              <p className="text-xl font-bold text-white">{displayData.engagement.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-500 font-bold">↑ 18.4% vs last 30 days</span>
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
            <div className="bg-[#050505] border border-slate-800 rounded-lg px-2 py-1 flex items-center gap-2 cursor-pointer">
              <span className="text-[10px] text-white font-medium">Daily</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.mentions_over_time || [
                { date: 'May 10', count: 1200 }, { date: 'May 15', count: 1900 }, { date: 'May 20', count: 1500 }, 
                { date: 'May 25', count: 2100 }, { date: 'May 30', count: 1800 }, { date: 'Jun 5', count: 2800 }, { date: 'Jun 10', count: 2500 }
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
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
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
                  data={[
                    { name: 'Positive', value: 51.6, color: '#10b981' },
                    { name: 'Negative', value: 19.9, color: '#ef4444' },
                    { name: 'Neutral', value: 28.5, color: '#f59e0b' }
                  ]}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xl font-bold text-white">24,532</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total</p>
            </div>
            <div className="mt-4 space-y-2 w-full">
               <LegendItem color="#10b981" label="Positive" percentage="51.6%" count="(12,652)" />
               <LegendItem color="#ef4444" label="Negative" percentage="19.9%" count="(4,895)" />
               <LegendItem color="#f59e0b" label="Neutral" percentage="28.5%" count="(6,985)" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Recent Mentions */}
        <div className="xl:col-span-1 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white">Recent Mentions</h3>
          </div>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <MentionPost user="sarahjohnson" time="2m ago" content="Love the new #CocaCola Zero Sugar! Best taste ever ❤️" sentiment="Positive" platform="twitter" />
            <MentionPost user="foodie_lover" time="5m ago" content="Just had a Coke and it was amazing! #TasteTheFeeling" sentiment="Positive" platform="instagram" />
            <MentionPost user="rohit_kumar" time="15m ago" content="Why is #CocaCola so overpriced now? 😡" sentiment="Negative" platform="x" />
            <MentionPost user="just_an_user" time="30m ago" content="Coca-Cola's new campaign is brilliant! 👏" sentiment="Positive" platform="reddit" />
          </div>
          <button className="w-full mt-6 text-xs text-blue-500 font-bold hover:underline">View all mentions →</button>
        </div>

        {/* Sentiment Trend */}
        <div className="xl:col-span-2 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white">Sentiment Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-slate-500">Positive</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[10px] text-slate-500">Negative</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[10px] text-slate-500">Neutral</span></div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { date: 'May 10', pos: 1200, neg: 400, neu: 600 },
                { date: 'May 20', pos: 1500, neg: 600, neu: 700 },
                { date: 'May 30', pos: 1300, neg: 700, neu: 800 },
                { date: 'Jun 10', pos: 1900, neg: 500, neu: 600 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="pos" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="neg" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="neu" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Top Keywords Column */}
        <div className="xl:col-span-1 flex flex-col gap-6">
           <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl flex-1">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-white">Top Keywords</h3>
               <div className="flex items-center gap-1 bg-[#050505] px-2 py-1 rounded text-[9px] text-slate-400">
                 All Platforms <ChevronDown className="w-3 h-3" />
               </div>
             </div>
             <div className="space-y-4">
               <KeywordItem text="#CocaCola" count="12,532" />
               <KeywordItem text="#TasteTheFeeling" count="8,421" />
               <KeywordItem text="#Coke" count="6,214" />
               <KeywordItem text="#CokeZero" count="4,215" />
               <KeywordItem text="#OpenHappiness" count="3,214" />
             </div>
             <button className="w-full mt-6 text-xs text-blue-500 font-bold hover:underline text-left">View all keywords →</button>
           </div>
        </div>
      </div>

      {/* Row with Alerts and Competitor Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-bold text-white">Alerts</h3>
             <button className="text-[10px] text-blue-500 font-bold hover:underline">View all</button>
           </div>
           <div className="space-y-4">
             <AlertItem type="Negative sentiment spike" msg="Negative mentions increased by 15.7% in the last 24 hours." time="2m ago" icon={<TrendingUp className="text-red-500 w-3 h-3" />} />
             <AlertItem type="High mention volume" msg="Mention volume is higher than usual in the last 1 hour." time="15m ago" icon={<MessageCircle className="text-amber-500 w-3 h-3" />} />
             <AlertItem type="New viral mention" msg="Your brand was mentioned in a viral post with 10k+ engagement." time="1h ago" icon={<Share2 className="text-blue-500 w-3 h-3" />} />
           </div>
        </div>

        <div className="xl:col-span-3 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white">Competitor Comparison</h3>
            <div className="bg-[#050505] border border-slate-800 rounded-lg px-2 py-1 flex items-center gap-2 cursor-pointer">
              <span className="text-[10px] text-white font-medium">Last 30 Days</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>
          </div>
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="pb-4 font-bold">Brand</th>
                <th className="pb-4 font-bold">Total Mentions</th>
                <th className="pb-4 font-bold">Positive %</th>
                <th className="pb-4 font-bold">Negative %</th>
                <th className="pb-4 font-bold">Neutral %</th>
                <th className="pb-4 font-bold text-right">Engagement</th>
              </tr>
            </thead>
            <tbody>
              <CompRow brand="Coca-Cola" mentions="24,532" pos={51.6} neg={19.9} neu={28.5} eng="98,765" logo="https://api.iconify.design/logos:coca-cola.svg" />
              <CompRow brand="Pepsi" mentions="18,421" pos={44.2} neg={22.1} neu={33.7} eng="76,432" logo="https://api.iconify.design/logos:pepsi.svg" />
              <CompRow brand="Sprite" mentions="8,125" pos={48.7} neg={17.3} neu={34.0} eng="32,109" logo="https://api.iconify.design/logos:sprite.svg" />
            </tbody>
          </table>
        </div>
      </div>
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
          {isNegativeTrend ? '↑' : '↑'} {trend} <span className="text-slate-600 font-normal">vs last 30 days</span>
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
    <span className="text-xs font-medium text-slate-400">{text}</span>
    <span className="text-xs font-bold text-white">{count}</span>
  </div>
);

const MentionPost = ({ user, time, content, sentiment, platform }) => (
  <div className="group">
    <div className="flex items-start justify-between mb-2">
       <div className="flex items-center gap-2">
         <div className="text-blue-400">
           {platform === 'twitter' && <MessageCircle className="w-3.5 h-3.5" />}
           {platform === 'instagram' && <MessageCircle className="w-3.5 h-3.5 text-pink-500" />}
           {platform === 'x' && <span className="text-white font-bold text-xs italic">X</span>}
           {platform === 'reddit' && <MessageCircle className="w-3.5 h-3.5 text-orange-500" />}
         </div>
         <span className="text-xs font-bold text-white">@{user}</span>
         <span className="text-[10px] text-slate-600">{time}</span>
       </div>
       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
         sentiment === 'Positive' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
       }`}>
         {sentiment}
       </span>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed mb-4 group-hover:text-slate-200 transition-colors">
      {content}
    </p>
    <div className="border-b border-slate-900 w-full mb-4 opacity-50"></div>
  </div>
);

const AlertItem = ({ type, msg, time, icon }) => (
  <div className="flex gap-3">
    <div className="mt-1 p-1 bg-slate-900 rounded border border-slate-800 flex-shrink-0">
      {icon}
    </div>
    <div>
       <div className="flex justify-between mb-0.5">
         <p className="text-[10px] font-bold text-white">{type}</p>
         <span className="text-[9px] text-slate-600">{time}</span>
       </div>
       <p className="text-[10px] text-slate-500 leading-tight">{msg}</p>
    </div>
  </div>
);

const CompRow = ({ brand, mentions, pos, neg, neu, eng, logo }) => (
  <tr className="border-b border-slate-800/50 group hover:bg-white/[0.02] transition-colors">
    <td className="py-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center p-1">
          <img src={logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt={brand} />
        </div>
        <span className="text-xs font-bold text-white">{brand}</span>
      </div>
    </td>
    <td className="py-4">
       <div className="flex items-center gap-2">
         <span className="text-xs font-bold text-white">{mentions}</span>
         <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
           <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
         </div>
       </div>
    </td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-emerald-500">{pos}%</span>
        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
           <div className="h-full bg-emerald-500" style={{ width: `${pos}%` }}></div>
         </div>
      </div>
    </td>
    <td className="py-4">
       <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-red-500">{neg}%</span>
        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
           <div className="h-full bg-red-500" style={{ width: `${neg}%` }}></div>
         </div>
      </div>
    </td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-amber-500">{neu}%</span>
        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
           <div className="h-full bg-amber-500" style={{ width: `${neu}%` }}></div>
         </div>
      </div>
    </td>
    <td className="py-4 text-right">
       <span className="text-xs font-bold text-white">{eng}</span>
    </td>
  </tr>
);

export default Dashboard;
