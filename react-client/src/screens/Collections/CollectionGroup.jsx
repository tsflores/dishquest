import CollectionHorizontalRow from '../../components/recipe/CollectionHorizontalRow';

export default function CollectionGroup({ collection, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          {collection.name} <span className="text-gray-400 font-normal">({collection.recipes.length})</span>
        </h3>
        {!collection.isDefault && (
          <button onClick={() => onDelete(collection)} className="text-xs text-paprika-red font-medium">
            Delete
          </button>
        )}
      </div>
      <CollectionHorizontalRow recipes={collection.recipes} />
    </div>
  );
}
