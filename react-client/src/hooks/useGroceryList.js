import { useState, useEffect, useCallback } from 'react';
import { groceryListService } from '../services/groceryListService';

export function useGroceryList() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    groceryListService.list()
      .then(setLists)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { lists, loading, error, reload: load };
}
