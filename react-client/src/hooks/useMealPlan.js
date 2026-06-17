import { useState, useEffect, useCallback } from 'react';
import { mealPlanService } from '../services/mealPlanService';

export function useMealPlan(weekStart) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    mealPlanService.list(weekStart)
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [weekStart]);

  useEffect(() => { load(); }, [load]);

  return { plans, loading, error, reload: load };
}
