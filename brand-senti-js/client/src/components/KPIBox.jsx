import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const KPIBox = ({ title, value, trend, color, data }) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-dark-card border border-dark-border p-5 rounded-2xl hover:border-slate-700 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">{title}</h4>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="h-10 w-full opacity-50 group-hover:opacity-80 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KPIBox;
