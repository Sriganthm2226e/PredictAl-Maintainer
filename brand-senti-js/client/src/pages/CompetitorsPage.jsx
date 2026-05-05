import React from 'react';

const CompetitorsPage = () => {
  const competitors = [
    { brand: 'Coca-Cola', mentions: 24532, pos: 51.6, neg: 19.9, neu: 28.5, engagement: 98765 },
    { brand: 'Pepsi', mentions: 18421, pos: 44.2, neg: 22.1, neu: 33.7, engagement: 76432 },
    { brand: 'Sprite', mentions: 8125, pos: 48.7, neg: 17.3, neu: 34.0, engagement: 32109 },
  ];
  return (
    <div className="p-6 bg-[#050505] min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Competitor Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-slate-800">
          <thead className="bg-[#0f1115]">
            <tr className="text-left text-sm text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-4">Brand</th>
              <th className="pb-3 px-4">Mentions</th>
              <th className="pb-3 px-4">Positive %</th>
              <th className="pb-3 px-4">Negative %</th>
              <th className="pb-3 px-4">Neutral %</th>
              <th className="pb-3 px-4 text-right">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr key={i} className="border-t border-slate-800 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-medium text-white flex items-center">
                  <img src={c.logo || `https://ui-avatars.com/api/?name=${c.brand}`} alt={c.brand} className="w-6 h-6 mr-2 rounded" />
                  {c.brand}
                </td>
                <td className="py-3 px-4 text-white">{c.mentions.toLocaleString()}</td>
                <td className="py-3 px-4 text-emerald-500">{c.pos}%</td>
                <td className="py-3 px-4 text-red-500">{c.neg}%</td>
                <td className="py-3 px-4 text-amber-500">{c.neu}%</td>
                <td className="py-3 px-4 text-right text-white">{c.engagement.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorsPage;
