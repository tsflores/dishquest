import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell({ title, back, action, children, hideNav = false }) {
  return (
    <div className="min-h-dvh bg-warm-cream">
      {!hideNav && <BottomNav />}
      <TopBar title={title} back={back} action={action} offsetSidebar={!hideNav} />
      <main className={`pt-14 ${hideNav ? 'pb-6' : 'pb-20 md:pb-8 md:pl-20'}`}>
        <div className="md:max-w-4xl md:mx-auto">{children}</div>
      </main>
    </div>
  );
}
