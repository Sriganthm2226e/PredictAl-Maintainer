import Header from '../components/Header.jsx';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

const SentimentPage = () => {
  const pieData = [
    { name: 'Positive', value: 51.6 },
    { name: 'Negative', value: 19.9 },
    { name: 'Neutral', value: 28.5 },
  ];

  const trendData = [
    { date: 'May 10', pos: 1200, neg: 400, neu: 600 },
    { date: 'May 15', pos: 1400, neg: 350, neu: 650 },
    { date: 'May 20', pos: 1500, neg: 600, neu: 700 },
    { date: 'May 25', pos: 1350, neg: 550, neu: 720 },
    { date: 'May 30', pos: 1300, neg: 700, neu: 800 },
    { date: 'Jun 5', pos: 1700, neg: 450, neu: 580 },
    { date: 'Jun 10', pos: 1900, neg: 500, neu: 600 },
  ];

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <Header title="Sentiment" subtitle="Detailed sentiment analysis across all mentions" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Sentiment Trend */}
        <div className="xl:col-span-2 bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-white mb-6">Sentiment Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="pos" stroke="#10b981" strokeWidth={2} dot={false} name="Positive" />
                <Line type="monotone" dataKey="neg" stroke="#ef4444" strokeWidth={2} dot={false} name="Negative" />
                <Line type="monotone" dataKey="neu" stroke="#f59e0b" strokeWidth={2} dot={false} name="Neutral" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl flex flex-col items-center">
          <h3 className="text-sm font-bold text-white mb-6 self-start">Distribution</h3>
          <div className="w-full h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-lg font-bold text-white">24,532</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Total</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 w-full">
            <LegendRow color="#10b981" label="Positive" pct="51.6%" />
            <LegendRow color="#ef4444" label="Negative" pct="19.9%" />
            <LegendRow color="#f59e0b" label="Neutral" pct="28.5%" />
          </div>
        </div>
      </div>

      {/* Word cloud placeholder */}
      <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
        <h3 className="text-sm font-bold text-white mb-6">Top Sentiment Keywords</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { word: "#CocaCola", size: "text-xl", color: "text-emerald-400" },
            { word: "#TasteTheFeeling", size: "text-lg", color: "text-blue-400" },
            { word: "overpriced", size: "text-base", color: "text-red-400" },
            { word: "amazing", size: "text-lg", color: "text-emerald-400" },
            { word: "#Coke", size: "text-xl", color: "text-amber-400" },
            { word: "terrible", size: "text-sm", color: "text-red-400" },
            { word: "brilliant", size: "text-base", color: "text-emerald-400" },
            { word: "#OpenHappiness", size: "text-lg", color: "text-blue-400" },
            { word: "refreshing", size: "text-base", color: "text-emerald-400" },
            { word: "#CokeZero", size: "text-lg", color: "text-amber-400" },
            { word: "sugar", size: "text-sm", color: "text-red-400" },
            { word: "love", size: "text-xl", color: "text-emerald-400" },
          ].map((w, i) => (
            <span key={i} className={`${w.size} ${w.color} font-bold px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-default`}>{w.word}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const LegendRow = ({ color, label, pct }) => (
  <div className="flex items-center justify-between text-[11px]">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-slate-400">{label}</span>
    </div>
    <span className="text-white font-bold">{pct}</span>
  </div>
);

export default SentimentPage;
