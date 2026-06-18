export default function OverviewTab({ recipe, source }) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {recipe.description ? (
        <p className="leading-relaxed">{recipe.description}</p>
      ) : (
        <p className="text-gray-400">No description available.</p>
      )}

      {source === 'internal' && recipe.meal && (
        <span className="inline-block px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">{recipe.meal}</span>
      )}

      {source === 'external' && recipe.nutrition && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(recipe.nutrition).filter(([, v]) => v).map(([key, value]) => (
            <div key={key} className="bg-white rounded-xl p-2 text-center shadow-sm">
              <p className="text-[10px] uppercase text-gray-400">{key}</p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {source === 'external' && recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-center text-pantry-slate text-sm font-semibold underline"
        >
          View original recipe ↗
        </a>
      )}
    </div>
  );
}
