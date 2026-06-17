import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';

export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setError(null);
    recipeService.list(params)
      .then(setRecipes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { recipes, loading, error };
}
