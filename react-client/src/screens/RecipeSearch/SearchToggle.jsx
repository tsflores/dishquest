const MODES = [
  { key: 'inapp', label: 'In-App' },
  { key: 'web', label: 'Web' },
];

export default function SearchToggle({ value, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-pill p-1">
      {MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => onChange(mode.key)}
          className={`flex-1 py-2 rounded-pill text-sm font-semibold transition-colors ${
            value === mode.key ? 'bg-white text-forest-green shadow-sm' : 'text-gray-500'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
