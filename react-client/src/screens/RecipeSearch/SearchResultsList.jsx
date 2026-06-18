import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import RecipeCardVertical from '../../components/recipe/RecipeCardVertical';

export default function SearchResultsList({ results, loading, error, searched, mode, hasMore, loadingMore, onLoadMore }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="text-primary w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return <p className="px-4 text-sm text-alert text-center py-6">{error}</p>;
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
    <div className="px-4 pb-6 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {results.map(({ recipe, source }, i) => (
          <RecipeCardVertical key={source === 'external' ? `${recipe.id}-${i}` : recipe._id} recipe={recipe} source={source} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? <Spinner className="w-4 h-4" /> : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
