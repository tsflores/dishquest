export default function Pill({ children, active = false, onClick, className = '' }) {
  const base =
    'inline-flex items-center rounded-pill px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors select-none';
  const state = active
    ? 'bg-pantry-slate text-white'
    : 'border border-gray-300 text-gray-600 bg-white hover:border-pantry-slate hover:text-pantry-slate';
  return (
    <button onClick={onClick} className={`${base} ${state} ${className}`}>
      {children}
    </button>
  );
}
