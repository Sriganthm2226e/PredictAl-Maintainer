import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, User, Edit3, LogOut } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2 bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition-all">
          <Calendar className="w-4 h-4" />
          <span>May 10, 2024 - Jun 10, 2024</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#050505]">3</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-800 cursor-pointer"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Ankit Verma</p>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=Ankit+Verma&background=random"
                className="w-8 h-8 rounded-full border border-slate-700"
                alt="Avatar"
              />
            </div>

            {showProfile && (
              <div className="absolute right-0 top-12 w-48 bg-[#0f1115] border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 py-2 z-50 animate-in">
                <button
                  onClick={() => { setShowProfile(false); navigate('/edit-profile'); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4" /> View Profile
                </button>
                <button
                  onClick={() => { setShowProfile(false); navigate('/edit-profile'); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  className="flex items-center gap-3 w-full px-4 py-3 text-xs text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
