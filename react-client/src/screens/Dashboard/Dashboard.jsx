import AppShell from '../../components/layout/AppShell';
import { useAuth } from '../../hooks/useAuth';
import GreetingSection from './GreetingSection';
import RecommendedGrid from './RecommendedGrid';
import WeeklyPlanPreview from './WeeklyPlanPreview';
import RecentlySavedRow from './RecentlySavedRow';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <AppShell title="DishQuest">
      <div className="px-4 py-6 space-y-6 md:px-8 md:py-8">
        <GreetingSection name={user?.name || user?.username} />
        <WeeklyPlanPreview />
        <RecommendedGrid />
        <RecentlySavedRow />
      </div>
    </AppShell>
  );
}
