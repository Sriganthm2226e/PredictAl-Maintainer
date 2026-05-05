"use client"
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Search, Bell, Download, Plus, TrendingUp, Users, MessageSquare, AlertCircle, Share2, MoreHorizontal
} from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [brand, setBrand] = useState('Apple');

  useEffect(() => {
    // Mock data for initial render
    const mockStats = {
      total_mentions: "1,250",
      positive: "650",
      negative: "200",
      neutral: "400",
      engagement: "5.4K",
      trends: [
        { name: 'Mon', mentions: 400, positive: 240, negative: 60 },
        { name: 'Tue', mentions: 300, positive: 139, negative: 80 },
        { name: 'Wed', mentions: 200, positive: 980, negative: 120 },
        { name: 'Thu', mentions: 278, positive: 390, negative: 100 },
        { name: 'Fri', mentions: 189, positive: 480, negative: 90 },
        { name: 'Sat', mentions: 239, positive: 380, negative: 70 },
        { name: 'Sun', mentions: 349, positive: 430, negative: 50 },
      ],
      pieData: [
        { name: 'Positive', value: 650 },
        { name: 'Neutral', value: 400 },
        { name: 'Negative', value: 200 },
      ],
      mentions: [
        { id: 1, user: '@tech_insider', content: "The new M3 chips are actually insane. Best laptop I've ever owned.", sentiment: 'positive', time: '2h ago' },
        { id: 2, user: '@daily_rants', content: "Why is the repair cost so high? $600 for a screen fix is robbery.", sentiment: 'negative', time: '4h ago' },
        { id: 3, user: '@gadget_guru', content: "Waiting for the official announcement before I make a decision.", sentiment: 'neutral', time: '5h ago' },
      ]
    };
    setData(mockStats);
  }, []);

  if (!data) return null;

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Monitoring impact for <span className="text-blue-500 font-semibold">{brand}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search brands..." 
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Brand
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Mentions" value={data.total_mentions} trend="+12.5%" icon={<MessageSquare />} />
        <KpiCard title="Positive" value={data.positive} trend="+8.2%" icon={<TrendingUp className="text-emerald-500" />} />
        <KpiCard title="Negative" value={data.negative} trend="-2.4%" icon={<AlertCircle className="text-red-500" />} />
        <KpiCard title="Engagement" value={data.engagement} trend="+15.0%" icon={<Share2 className="text-blue-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Mentions Over Time</h3>
            <select className="bg-transparent text-slate-400 text-sm focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="mentions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMentions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Sentiment Split</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{data.total_mentions}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Total</span>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <LegendItem color="bg-emerald-500" label="Pos" />
            <LegendItem color="bg-amber-500" label="Neu" />
            <LegendItem color="bg-red-500" label="Neg" />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mentions */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Mentions</h3>
            <button className="text-sm text-blue-500 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {data.mentions.map((m) => (
              <div key={m.id} className="flex gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-400">
                  {m.user[1].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{m.user}</span>
                    <span className="text-xs text-slate-500">{m.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{m.content}</p>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      m.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : 
                      m.sentiment === 'negative' ? 'bg-red-500/10 text-red-500' : 
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {m.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitors Table */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Competitor Comparison</h3>
            <button className="text-slate-400 hover:text-white">
              <MoreHorizontal />
            </button>
          </div>
          <table className="w-100 w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Mentions</th>
                <th className="pb-3 font-medium">Positive %</th>
                <th className="pb-3 font-medium text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <CompetitorRow name="Samsung" mentions="890" pos="54%" impact="high" />
              <CompetitorRow name="Google" mentions="1.1K" pos="62%" impact="medium" />
              <CompetitorRow name="Microsoft" mentions="1.4K" pos="58%" impact="high" />
              <CompetitorRow name="Sony" mentions="450" pos="70%" impact="low" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all cursor-default group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
          {React.cloneElement(icon, { className: "w-5 h-5 text-slate-400" })}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
    </div>
  );
}

function CompetitorRow({ name, mentions, pos, impact }) {
  return (
    <tr className="border-b border-slate-800/50 group">
      <td className="py-4 font-medium text-white">{name}</td>
      <td className="py-4 text-slate-400">{mentions}</td>
      <td className="py-4 text-emerald-500">{pos}</td>
      <td className="py-4 text-right">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
          impact === 'high' ? 'bg-blue-500/10 text-blue-500' : 
          impact === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
          'bg-slate-500/10 text-slate-500'
        }`}>
          {impact}
        </span>
      </td>
    </tr>
  );
}
