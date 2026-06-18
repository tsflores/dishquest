import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import { recipeService } from '../../services/recipeService';

export default function RecipePickerList({ onPick }) {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = query.trim() ? { q: query.trim() } : {};
    const handle = setTimeout(() => {
      recipeService.list(params)
        .then(setRecipes)
        .catch(() => setRecipes([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes..."
        autoFocus
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
      />
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner className="text-primary" />
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No recipes found.</p>
      ) : (
        <div className="space-y-2 max-h-[45vh] overflow-y-auto">
          {recipes.map((r) => (
            <button
              key={r._id}
              onClick={() => onPick(r)}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {r.image && <img src={r.image} alt={r.name} className="w-full h-full object-cover" />}
              </div>
              <span className="text-sm font-medium text-gray-900 line-clamp-1">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
