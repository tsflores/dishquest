import { useState } from 'react';
import GroceryItemRow from './GroceryItemRow';

export default function CategorySection({ category, items, onToggle }) {
  const [collapsed, setCollapsed] = useState(false);
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between mb-2"
      >
        <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{checkedCount}/{items.length}</span>
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>
      {!collapsed && (
        <div className="space-y-1.5">
          {items.map((item) => (
            <GroceryItemRow key={item._id} item={item} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
