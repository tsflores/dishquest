import { useState, useEffect } from 'react';
import CollectionHorizontalRow from '../../components/recipe/CollectionHorizontalRow';
import Spinner from '../../components/ui/Spinner';
import { collectionService } from '../../services/collectionService';

export default function RecentlySavedRow() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectionService.list()
      .then((collections) => {
        const all = collections.flatMap((c) => c.recipes);
        all.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        setRecipes(all.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Recently saved</h3>
      {loading ? (
        <div className="flex justify-center py-4">
          <Spinner className="text-primary" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-card shadow-sm p-4 text-sm text-gray-400 text-center">
          Save recipes to collections to see them here.
        </div>
      ) : (
        <CollectionHorizontalRow recipes={recipes} />
      )}
    </div>
  );
}
