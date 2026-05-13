import React, { useState } from 'react';
import { 
  TrendingUp, Sparkles, Shirt, ShoppingBag, Flame, Compass, 
  ArrowUpRight, Heart, Share2, BarChart2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const FashionTrendsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const trends = [
    {
      id: 1,
      title: "Cyberpunk Techwear",
      category: "Aesthetics",
      velocity: "+45.2%",
      sentiment: "Highly Positive",
      volume: "18.4K posts",
      desc: "Waterproof functional outerwear, matte-black accessories, high-utility strap accents, and modular harnesses are spiking in urban forums.",
      score: 94,
      hashtags: ["#techwear", "#gorpcore", "#cyberpunkfashion"]
    },
    {
      id: 2,
      title: "Y2K Futurism",
      category: "Apparel",
      velocity: "+38.9%",
      sentiment: "Positive",
      volume: "14.2K posts",
      desc: "Metallic silver puffer jackets, wraparound sport sunglasses, and translucent plastic fabrics are gaining huge traction on Instagram and TikTok.",
      score: 88,
      hashtags: ["#y2kfashion", "#futuristic", "#metallicvibe"]
    },
    {
      id: 3,
      title: "Eco Minimalist",
      category: "Fabrics",
      velocity: "+29.4%",
      sentiment: "Positive",
      volume: "11.1K posts",
      desc: "Raw organic linens, hemp blends, and un-dyed earth tones are trending heavily among sustainability-focused luxury consumer cohorts.",
      score: 85,
      hashtags: ["#sustainablefashion", "#minimalstyle", "#organiccotton"]
    },
    {
      id: 4,
      title: "Neon Acid Wash",
      category: "Colors",
      velocity: "-12.5%",
      sentiment: "Neutral",
      volume: "3.4K posts",
      desc: "Bright highlighter-yellow and hot-pink bleached streetwear items are experiencing a slight cooldown following a massive spring peak.",
      score: 42,
      hashtags: ["#acidwash", "#neoncolor", "#streetwearfeed"]
    },
    {
      id: 5,
      title: "Quiet Luxury Tailoring",
      category: "Aesthetics",
      velocity: "+52.1%",
      sentiment: "Exceptional",
      volume: "22.5K posts",
      desc: "Sartorial relaxed blazers, cashmere overcoats, logo-less premium leather accessories, and bespoke neutral tones are dominating high-fashion listenings.",
      score: 97,
      hashtags: ["#quietluxury", "#oldmoney", "#minimalistblazer"]
    }
  ];

  const categories = ["All", "Aesthetics", "Apparel", "Fabrics", "Colors"];

  const filteredTrends = selectedCategory === "All" 
    ? trends 
    : trends.filter(t => t.category === selectedCategory);

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Shirt className="w-8 h-8 text-indigo-500" />
            AI FASHION TREND ENGINE
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Predictive forecasting models tracking aesthetic volume shifts across global digital storefronts and social platforms
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30"
                  : "bg-[#0f1115] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {filteredTrends.map((trend, idx) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="bg-[#0f1115] border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-6 relative overflow-hidden group transition-all"
          >
            {/* Top Row: Title & Category */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  {trend.category}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-3 flex items-center gap-2">
                  {trend.title}
                  {trend.score > 90 && (
                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  )}
                </h3>
              </div>

              {/* Growth Velocity */}
              <div className="text-right">
                <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-md flex items-center gap-1 ${
                  trend.velocity.startsWith('+') 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-red-400 bg-red-500/10'
                }`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${trend.velocity.startsWith('-') ? 'rotate-180 text-red-400' : 'text-emerald-400'}`} />
                  {trend.velocity}
                </span>
                <span className="text-[9px] text-slate-500 block mt-1.5 font-mono">{trend.volume}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
              {trend.desc}
            </p>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {trend.hashtags.map((tag) => (
                <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-[#050505] border border-slate-900 px-2 py-0.5 rounded-md hover:text-white transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer: Trend Score Bar */}
            <div className="border-t border-slate-900/80 pt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  AI Prediction Strength
                </span>
                <span className={`text-[11px] font-black font-mono ${
                  trend.score > 90 ? 'text-indigo-400' :
                  trend.score > 80 ? 'text-blue-400' : 'text-slate-400'
                }`}>
                  {trend.score}% Confidence
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    trend.score > 90 ? 'bg-indigo-500' :
                    trend.score > 80 ? 'bg-blue-500' : 'bg-slate-600'
                  }`} 
                  style={{ width: `${trend.score}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Trend Insights Callout */}
      <div className="bg-gradient-to-r from-indigo-950/10 via-[#0f1115] to-[#0f1115] border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-2xl"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Predictive Trend Insights</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Our neural prediction networks monitor apparel SKU indices and retail merchant catalog additions daily. Over the next quarter, 
              expect a heavy market consolidation into <strong>Quiet Luxury Tailoring</strong> and organic <strong>sustainable fabric blends</strong>, 
              as high-income bracket cohorts pivot away from neon-accented fast streetwear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionTrendsPage;
