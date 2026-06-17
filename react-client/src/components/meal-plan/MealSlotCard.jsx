export default function MealSlotCard({ slot, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-card p-3 shadow-sm">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {slot.recipeImage ? (
          <img src={slot.recipeImage} alt={slot.recipeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🍽</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase font-medium">{slot.mealType}</p>
        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{slot.recipeName}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}
