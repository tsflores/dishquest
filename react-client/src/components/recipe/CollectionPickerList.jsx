import { useState } from 'react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useCollections } from '../../hooks/useCollections';
import { collectionService } from '../../services/collectionService';

export default function CollectionPickerList({ onPick }) {
  const { collections, loading, reload } = useCollections();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const collection = await collectionService.create(name.trim());
      setName('');
      reload();
      onPick(collection);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner className="text-pantry-slate" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[40vh] overflow-y-auto">
          {collections.map((c) => (
            <button
              key={c._id}
              onClick={() => onPick(c)}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-900 transition-colors"
            >
              {c.name} <span className="text-gray-400 text-xs">({c.recipes.length})</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pantry-slate"
        />
        <Button variant="outline" onClick={handleCreate} disabled={creating || !name.trim()}>
          {creating ? <Spinner /> : 'Create'}
        </Button>
      </div>
    </div>
  );
}
