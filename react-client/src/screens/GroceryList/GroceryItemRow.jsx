export default function GroceryItemRow({ item, onToggle }) {
  return (
    <button
      onClick={() => onToggle(item._id)}
      className="w-full flex items-center gap-3 bg-white rounded-card px-3 py-2.5 text-left"
    >
      <span
        className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
          item.checked ? 'bg-herb-green border-herb-green text-white' : 'border-gray-300'
        }`}
      >
        {item.checked && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className={`flex-1 text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
        {item.name}
      </span>
      {item.quantity && (
        <span className={`text-xs ${item.checked ? 'text-gray-300' : 'text-gray-400'}`}>{item.quantity}</span>
      )}
    </button>
  );
}
