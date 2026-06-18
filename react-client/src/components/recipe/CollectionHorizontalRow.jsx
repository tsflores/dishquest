import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Thumb({ entry, onClick, onRemove }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-32 flex-shrink-0 relative">
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(entry);
          }}
          aria-label={`Remove ${entry.recipeName}`}
          className="absolute -top-1.5 -right-1.5 z-10 w-6 h-6 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-alert hover:border-alert text-sm leading-none"
        >
          ×
        </button>
      )}
      <div
        className="bg-white rounded-card overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        onClick={onClick}
      >
        <div className="aspect-square bg-gray-100">
          {entry.recipeImage && !failed ? (
            <img
              src={entry.recipeImage}
              alt={entry.recipeName}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽</div>
          )}
        </div>
        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug p-2">{entry.recipeName}</p>
      </div>
    </div>
  );
}

export default function CollectionHorizontalRow({ recipes, onRemove }) {
  const navigate = useNavigate();

  if (!recipes.length) {
    return <p className="text-sm text-gray-400 py-2">No recipes saved yet.</p>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 pt-1.5">
      {recipes.map((entry) => {
        const path = entry.recipeSource === 'external'
          ? `/recipe/external/${entry.recipeId}`
          : `/recipe/${entry.recipeId}`;
        return (
          <Thumb
            key={`${entry.recipeSource}-${entry.recipeId}`}
            entry={entry}
            onClick={() => navigate(path)}
            onRemove={onRemove ? () => onRemove(entry) : undefined}
          />
        );
      })}
    </div>
  );
}
