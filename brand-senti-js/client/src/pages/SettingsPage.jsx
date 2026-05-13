import React, { useState } from 'react';
import { 
  Settings, Sliders, Key, Shield, Bell, RefreshCw, 
  Cpu, Database, Check, Eye, EyeOff, Save 
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState("sk_live_your_stripe_api_key_here");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Settings values
  const [scanInterval, setScanInterval] = useState("15m");
  const [toxicityThreshold, setToxicityThreshold] = useState(65);
  const [urgencyThreshold, setUrgencyThreshold] = useState(70);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveSettings = () => {
    alert("System configurations and threshold limits updated successfully!");
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Top Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-slate-400" />
            PLATFORM CONFIGURATION
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage thresholds, scan frequencies, webhooks, and secure developer API credentials
          </p>
        </div>

        <button
          onClick={saveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start xl:self-center cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Left Column: API Frequencies & Scanning */}
        <div className="xl:col-span-2 space-y-6">
          {/* Scanning Frequencies */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Scan Frequencies
            </h3>
            <p className="text-xs text-slate-500 mb-6">Set the background listening intervals for automated platform scanning on keyword mention pools</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { id: "5m", label: "Realtime (5m)", desc: "Heavy CPU usage" },
                { id: "15m", label: "Standard (15m)", desc: "Optimal balance" },
                { id: "1h", label: "Hourly (1h)", desc: "Slight delay" },
                { id: "1d", label: "Daily (1d)", desc: "Static audits" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScanInterval(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    scanInterval === item.id
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-[#050505] border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="text-[9px] text-slate-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Alert Threshold Sensitivity */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Neural Alert Sensitivity
            </h3>
            <p className="text-xs text-slate-500 mb-6">Tune the minimum classification scores required to trigger real-time push alerts and crisis overlays</p>
            
            <div className="space-y-6">
              {/* Toxicity Slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400 font-extrabold">Toxicity Trigger Sensitivity</span>
                  <span className="text-red-400 font-bold font-mono">{toxicityThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={toxicityThreshold}
                  onChange={(e) => setToxicityThreshold(parseInt(e.target.value))}
                  className="w-full accent-red-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-600 block mt-1.5">Fires a crisis warning when comment text toxicity crosses this limit.</span>
              </div>

              {/* Urgency Slider */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400 font-extrabold">Urgency Severity Trigger</span>
                  <span className="text-indigo-400 font-bold font-mono">{urgencyThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={urgencyThreshold}
                  onChange={(e) => setUrgencyThreshold(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-600 block mt-1.5">Triggers a high priority task card if customer support action is flagged.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: API Keys & Integration Channels */}
        <div className="space-y-6">
          {/* API Key Credentials */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Developer API Key
            </h3>
            <p className="text-xs text-slate-500 mb-6">Use this token to pull sentiment metrics into external SaaS dashboards, scripts, or analytics engines</p>
            
            <div className="relative mb-4">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="w-full bg-[#050505] border border-slate-900 rounded-xl py-3 pl-4 pr-12 text-[10px] font-mono text-slate-300 focus:outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={copyApiKey}
              className="w-full bg-[#050505] hover:bg-slate-900 border border-slate-800 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 text-slate-300 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
              <span>{copied ? "API Token Copied" : "Copy API Token"}</span>
            </button>
          </div>

          {/* Alert Delivery Channels */}
          <div className="bg-[#0f1115] border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              Delivery Channels
            </h3>
            <p className="text-xs text-slate-500 mb-6">Set up external notification webhooks and emails for fast team dispatch on PR incidents</p>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 bg-[#050505] rounded-xl border border-slate-900 hover:border-slate-800 transition-all">
                <div>
                  <span className="text-xs font-black text-white block">Email Dispatch Reports</span>
                  <span className="text-[9px] text-slate-600 block mt-0.5">Send a weekly summary to admin email</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 bg-[#050505] rounded-xl border border-slate-900 hover:border-slate-800 transition-all">
                <div>
                  <span className="text-xs font-black text-white block">Slack Webhook alerts</span>
                  <span className="text-[9px] text-slate-600 block mt-0.5">Forward warnings to #brand-crisis-feed</span>
                </div>
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
