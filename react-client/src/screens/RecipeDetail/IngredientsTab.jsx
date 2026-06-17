export default function IngredientsTab({ recipe, source }) {
  if (source === 'internal') {
    return (
      <div className="bg-white rounded-card p-4 text-sm text-gray-500 text-center">
        Ingredients are in the recipe PDF — see the Instructions tab.
      </div>
    );
  }

  if (!recipe.ingredients?.length) {
    return <p className="text-sm text-gray-400 text-center py-6">No ingredients available.</p>;
  }

  return (
    <ul className="space-y-2">
      {recipe.ingredients.map((ingredient, i) => (
        <li key={i} className="bg-white rounded-xl px-3 py-2 text-sm text-gray-700 shadow-sm">
          {ingredient}
        </li>
      ))}
    </ul>
  );
}
