import { useState, useEffect, useCallback } from 'react';
import { mealPlanService } from '../services/mealPlanService';

export function useMealPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    mealPlanService.list()
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { plans, loading, error, reload: load };
}
