import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, BarChart3, Bell, FileText, Users, UserPlus, Settings,
  ChevronDown, Menu, Zap, TrendingUp, Shirt
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: MessageSquare, label: "Mentions", path: "/mentions" },
    { icon: BarChart3, label: "Sentiment", path: "/sentiment" },
    { icon: Bell, label: "Alerts", path: "/alerts", badge: "3" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Users, label: "Competitors", path: "/competitors" },
    { icon: UserPlus, label: "Influencers", path: "/influencers" },
    { icon: Shirt, label: "Fashion Trends", path: "/fashion-trends" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-[#0f1115] border-r border-slate-900 flex flex-col p-5 sticky top-0 flex-shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <MessageSquare className="text-white w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">BrandSenti</h1>
        <Menu className="w-5 h-5 text-slate-500 ml-auto cursor-pointer" />
      </div>

      {/* Brand Selector */}
      <div className="bg-[#050505] border border-slate-800 rounded-xl px-4 py-3 mb-8 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-all">
        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">C</div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white leading-none">Coca-Cola</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative no-underline ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "group-hover:text-slate-200"}`} />
              <span className="font-semibold text-xs">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade Box */}
      <div className="mt-6 bg-[#050505] border border-slate-800 p-5 rounded-2xl">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Current Plan</p>
        <p className="text-sm font-bold text-indigo-500 mb-4">Professional</p>
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <span>Mentions Left</span>
            <span className="text-white">18,450 / 50,000</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: '37%' }}></div>
          </div>
        </div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20">
          <Zap className="w-3.5 h-3.5" /> Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
