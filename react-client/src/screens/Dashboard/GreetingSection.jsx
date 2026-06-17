export default function GreetingSection({ name }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{greeting}, {name} 👋</h2>
      <p className="text-sm text-gray-500">What are we cooking today?</p>
    </div>
  );
}
