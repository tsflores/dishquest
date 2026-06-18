import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeWebBadge from './RecipeWebBadge';

export default function RecipeCardVertical({ recipe, source = 'internal' }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const id = source === 'external' ? recipe.id : recipe._id;
  const path = source === 'external' ? `/recipe/external/${id}` : `/recipe/${id}`;
  const label = recipe.name || recipe.label;
  const image = recipe.image?.url || recipe.image;

  return (
    <div
      className="bg-white rounded-card overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate(path, source === 'external' ? { state: { recipe } } : undefined)}
    >
      <div className="aspect-square bg-gray-100 relative">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🍽</div>
        )}
        {source === 'external' && (
          <span className="absolute top-2 right-2">
            <RecipeWebBadge />
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{label}</p>
        {source === 'external' && recipe.sourceDomain && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{recipe.sourceDomain}</p>
        )}
      </div>
    </div>
  );
}
