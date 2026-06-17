import AppShell from '../../components/layout/AppShell';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <AppShell title="NourishPlan">
      <div className="px-4 py-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Hello, {user?.name || user?.username} 👋
        </h2>
        <p className="text-sm text-gray-500">Dashboard coming in Phase 3.</p>
      </div>
    </AppShell>
  );
}
