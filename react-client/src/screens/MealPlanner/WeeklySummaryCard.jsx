import ProgressBar from '../../components/ui/ProgressBar';
import { WEEK_DAYS } from '../../utils/constants';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const TOTAL_SLOTS = WEEK_DAYS.length * MEAL_TYPES.length;

export default function WeeklySummaryCard({ slots, weekLabel }) {
  const counts = MEAL_TYPES.reduce((acc, mt) => {
    acc[mt] = slots.filter((s) => s.mealType === mt).length;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-card shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{weekLabel}</h3>
        <span className="text-xs text-gray-400">{slots.length} of {TOTAL_SLOTS} meals planned</span>
      </div>
      <ProgressBar value={slots.length} max={TOTAL_SLOTS} />
      <div className="flex justify-between text-xs text-gray-500">
        {MEAL_TYPES.map((mt) => (
          <span key={mt} className="capitalize">{mt}: {counts[mt]}</span>
        ))}
      </div>
    </div>
  );
}
