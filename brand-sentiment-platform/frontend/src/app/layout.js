import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrandSentiment AI - Monitor Your Brand Impact",
  description: "Real-time AI-powered social media sentiment analysis and brand monitoring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#020617]">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-[#020617] p-6 hidden md:block">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
              <h1 className="text-xl font-bold text-white tracking-tight">BrandSentiment</h1>
            </div>
            
            <nav className="space-y-1">
              <NavItem icon="Dashboard" label="Dashboard" active />
              <NavItem icon="Mentions" label="Mentions" />
              <NavItem icon="Sentiment" label="Sentiment" />
              <NavItem icon="Alerts" label="Alerts" />
              <NavItem icon="Reports" label="Reports" />
              <NavItem icon="Competitors" label="Competitors" />
              <NavItem icon="Influencers" label="Influencers" />
              <NavItem icon="Settings" label="Settings" />
            </nav>
          </aside>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
