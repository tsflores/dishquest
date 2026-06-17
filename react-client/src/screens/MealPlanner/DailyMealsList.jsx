import MealSlotCard from '../../components/meal-plan/MealSlotCard';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function DailyMealsList({ slots, onRemove }) {
  const sorted = [...slots].sort((a, b) => MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType));

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-card shadow-sm p-6 text-sm text-gray-400 text-center">
        No meals planned for this day yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((slot) => (
        <MealSlotCard key={slot._id} slot={slot} onRemove={() => onRemove(slot._id)} />
      ))}
    </div>
  );
}
