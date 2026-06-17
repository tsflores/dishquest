const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'instructions', label: 'Instructions' },
];

export default function DetailTabs({ active, onChange }) {
  return (
    <div className="flex mt-4 border-b border-gray-200">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            active === t.key ? 'border-forest-green text-forest-green' : 'border-transparent text-gray-400'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
