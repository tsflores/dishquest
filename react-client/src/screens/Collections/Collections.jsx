import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import CollectionFilterTabs from './CollectionFilterTabs';
import CollectionGroup from './CollectionGroup';
import ImportUrlModal from './ImportUrlModal';
import { useCollections } from '../../hooks/useCollections';
import { collectionService } from '../../services/collectionService';

export default function Collections() {
  const { collections, loading, reload } = useCollections();
  const [active, setActive] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const visible = active ? collections.filter((c) => c._id === active) : collections;

  const handleDelete = async (collection) => {
    if (!window.confirm(`Delete "${collection.name}"? This can't be undone.`)) return;
    await collectionService.delete(collection._id);
    if (active === collection._id) setActive(null);
    reload();
  };

  const handleRemoveRecipe = async (collection, entry) => {
    if (!window.confirm(`Remove "${entry.recipeName}" from ${collection.name}?`)) return;
    await collectionService.removeRecipe(collection._id, entry.recipeId);
    reload();
  };

  return (
    <AppShell title="Collections">
      <div className="px-4 py-6 space-y-5 md:px-8 md:py-8">
        <CollectionFilterTabs
          collections={collections}
          active={active}
          onChange={setActive}
          onCreated={reload}
        />

        <Button variant="outline" className="w-full" onClick={() => setImportOpen(true)}>
          Import recipe from URL
        </Button>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-primary w-8 h-8" />
          </div>
        ) : visible.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No collections yet.</p>
        ) : (
          <div className="space-y-6">
            {visible.map((c) => (
              <CollectionGroup
                key={c._id}
                collection={c}
                onDelete={handleDelete}
                onRemoveRecipe={handleRemoveRecipe}
              />
            ))}
          </div>
        )}
      </div>

      <ImportUrlModal open={importOpen} onClose={() => setImportOpen(false)} onSaved={reload} />
    </AppShell>
  );
}
