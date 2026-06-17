import RecipeWebBadge from '../../components/recipe/RecipeWebBadge';
import { formatTime } from '../../utils/formatTime';

export default function DetailHeader({ recipe, source }) {
  const prep = formatTime(recipe.preptime);
  const cook = formatTime(recipe.cooktime);

  return (
    <div className="bg-white rounded-card shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold text-gray-900 leading-snug">{recipe.name}</h2>
        {source === 'external' && <RecipeWebBadge />}
      </div>
      <p className="text-sm text-gray-500">
        {source === 'internal' ? `By ${recipe.chef}` : recipe.sourceDomain || 'Web recipe'}
      </p>
      <div className="flex gap-4 text-xs text-gray-500">
        {prep && <span>Prep: {prep}</span>}
        {cook && <span>Cook: {cook}</span>}
        {recipe.servings && <span>Serves: {recipe.servings}</span>}
      </div>
    </div>
  );
}
