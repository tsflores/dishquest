import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CollectionHorizontalRow from '../../components/recipe/CollectionHorizontalRow';
import Spinner from '../../components/ui/Spinner';
import { useMealPlan } from '../../hooks/useMealPlan';
import { getMondayISO } from '../../utils/weekDates';
import { WEEK_DAYS } from '../../utils/constants';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function WeeklyPlanPreview() {
  const weekStartISO = useMemo(() => getMondayISO(), []);
  const { plans, loading } = useMealPlan(weekStartISO);

  const plan = plans[0] || null;
  const slots = [...(plan?.slots || [])].sort((a, b) => {
    const dayDiff = WEEK_DAYS.indexOf(a.day) - WEEK_DAYS.indexOf(b.day);
    return dayDiff !== 0 ? dayDiff : MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">This week's plan</h3>
        <Link to="/planner" className="text-xs font-medium text-pantry-slate">View full plan</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-4">
          <Spinner className="text-pantry-slate" />
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-card shadow-sm p-4 text-sm text-gray-400 text-center">
          No meals planned yet — tap "View full plan" to get started.
        </div>
      ) : (
        <CollectionHorizontalRow recipes={slots} />
      )}
    </div>
  );
}
