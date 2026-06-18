import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { useAuth } from '../../hooks/useAuth';
import GreetingSection from './GreetingSection';
import RecommendedGrid from './RecommendedGrid';
import WeeklyPlanPreview from './WeeklyPlanPreview';
import RecentlySavedRow from './RecentlySavedRow';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      action={
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="text-gray-400 hover:text-alert transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </button>
      }
    >
      <div className="px-4 py-6 space-y-6 md:px-8 md:py-8">
        <GreetingSection name={user?.name || user?.username} />
        <WeeklyPlanPreview />
        <RecommendedGrid />
        <RecentlySavedRow />
      </div>
    </AppShell>
  );
}
