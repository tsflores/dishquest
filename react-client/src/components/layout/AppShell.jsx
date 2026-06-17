import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell({ title, back, action, children, hideNav = false }) {
  return (
    <div className="flex flex-col min-h-dvh bg-warm-cream">
      <TopBar title={title} back={back} action={action} />
      <main className="flex-1 overflow-y-auto pb-20 pt-14">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
