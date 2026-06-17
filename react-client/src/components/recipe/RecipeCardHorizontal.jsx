import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeWebBadge from './RecipeWebBadge';

export default function RecipeCardHorizontal({ recipe, source = 'internal' }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const id = source === 'external' ? recipe.id : recipe._id;
  const path = source === 'external' ? `/recipe/external/${id}` : `/recipe/${id}`;
  const label = recipe.name || recipe.label;
  const image = recipe.image?.url || recipe.image;

  return (
    <div
      className="flex gap-3 bg-white rounded-card p-3 shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => navigate(path, source === 'external' ? { state: { recipe } } : undefined)}
    >
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🍽</div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{label}</p>
        {source === 'external' && <RecipeWebBadge />}
      </div>
    </div>
  );
}
