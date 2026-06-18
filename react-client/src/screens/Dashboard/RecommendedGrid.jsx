import { useMemo } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import RecipeCardVertical from '../../components/recipe/RecipeCardVertical';
import Spinner from '../../components/ui/Spinner';

export default function RecommendedGrid() {
  const { recipes, loading } = useRecipes();

  const sample = useMemo(
    () => [...recipes].sort(() => Math.random() - 0.5).slice(0, 6),
    [recipes]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="text-pantry-slate" />
      </div>
    );
  }

  if (!sample.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommended for you</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sample.map((recipe) => (
          <RecipeCardVertical key={recipe._id} recipe={recipe} source="internal" />
        ))}
      </div>
    </div>
  );
}
