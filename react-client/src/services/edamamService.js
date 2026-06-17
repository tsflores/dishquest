import { apiFetch } from './api';

export const edamamService = {
  search: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/edamam/search?${qs}`);
  },
};

function nutrientValue(nutrient) {
  if (!nutrient) return null;
  return `${Math.round(nutrient.quantity)} ${nutrient.unit}`;
}

// Edamam recipe URIs look like ".../edamam.owl#recipe_<hash>" — there is no
// get-by-id endpoint, so this id only ever resolves via router state passed
// from the search result card, never a re-fetch.
export function normalizeEdamamHit(hit) {
  const r = hit.recipe || {};
  const nutrients = r.totalNutrients || {};
  return {
    id: encodeURIComponent((r.uri || '').split('#').pop()),
    name: r.label,
    image: r.image,
    description: null,
    sourceUrl: r.url,
    sourceDomain: r.source,
    ingredients: r.ingredientLines || [],
    instructions: [],
    preptime: null,
    cooktime: r.totalTime || null,
    servings: r.yield ? String(r.yield) : null,
    cuisineType: r.cuisineType,
    mealType: r.mealType,
    dishType: r.dishType,
    nutrition: r.calories ? {
      calories: `${Math.round(r.calories)} kcal`,
      protein: nutrientValue(nutrients.PROCNT),
      carbs: nutrientValue(nutrients.CHOCDF),
      fat: nutrientValue(nutrients.FAT),
      fiber: nutrientValue(nutrients.FIBTG),
    } : null,
  };
}
