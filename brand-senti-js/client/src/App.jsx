import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import MentionsPage from './pages/MentionsPage.jsx';
import SentimentPage from './pages/SentimentPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import CompetitorsPage from './pages/CompetitorsPage.jsx';
import InfluencersPage from './pages/InfluencersPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import FashionTrendsPage from './pages/FashionTrendsPage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';

function App() {
  return (
    <div className="flex bg-[#050505] text-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mentions" element={<MentionsPage />} />
          <Route path="/sentiment" element={<SentimentPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/competitors" element={<CompetitorsPage />} />
          <Route path="/influencers" element={<InfluencersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/fashion-trends" element={<FashionTrendsPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
