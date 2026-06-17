import Spinner from '../../components/ui/Spinner';
import RecipeCardVertical from '../../components/recipe/RecipeCardVertical';

export default function SearchResultsList({ results, loading, error, searched, mode }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="text-forest-green w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return <p className="px-4 text-sm text-red-500 text-center py-6">{error}</p>;
  }

  if (!searched) {
    return (
      <p className="px-4 text-sm text-gray-400 text-center py-10">
        {mode === 'inapp' ? 'Browse saved recipes or search by name.' : 'Search the web for recipes powered by Edamam.'}
      </p>
    );
  }

  if (results.length === 0) {
    return <p className="px-4 text-sm text-gray-400 text-center py-10">No recipes found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 pb-6 md:px-8">
      {results.map(({ recipe, source }) => (
        <RecipeCardVertical key={source === 'external' ? recipe.id : recipe._id} recipe={recipe} source={source} />
      ))}
    </div>
  );
}
