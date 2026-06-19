import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Spinner from '../../components/ui/Spinner';
import WeekCalendarStrip from '../../components/meal-plan/WeekCalendarStrip';
import WeeklySummaryCard from './WeeklySummaryCard';
import DailyMealsList from './DailyMealsList';
import AddMealFAB from './AddMealFAB';
import { useMealPlan } from '../../hooks/useMealPlan';
import { mealPlanService } from '../../services/mealPlanService';
import { WEEK_DAYS } from '../../utils/constants';

function todayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function MealPlanner() {
  const { plans, loading, reload } = useMealPlan();
  const [selectedDay, setSelectedDay] = useState(todayIndex());

  const plan = plans[0] || null;
  const slots = plan?.slots || [];
  const daySlots = slots.filter((s) => s.day === WEEK_DAYS[selectedDay]);

  const handleAdd = async (mealType, recipe) => {
    let planId = plan?._id;
    if (!planId) {
      const created = await mealPlanService.create();
      planId = created._id;
    }
    await mealPlanService.addSlot(planId, {
      day: WEEK_DAYS[selectedDay],
      mealType,
      recipeId: recipe._id,
      recipeSource: 'internal',
      recipeName: recipe.name,
      recipeImage: recipe.image,
    });
    reload();
  };

  const handleRemove = async (slotId) => {
    if (!plan) return;
    await mealPlanService.removeSlot(plan._id, slotId);
    reload();
  };

  return (
    <AppShell title="Meal Planner">
      <div className="py-6 space-y-5 md:px-8 md:py-8">
        <WeekCalendarStrip selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <div className="px-4 space-y-5 md:px-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner className="text-primary w-8 h-8" />
            </div>
          ) : (
            <>
              <WeeklySummaryCard slots={slots} weekLabel="Weekly Plan" />
              <DailyMealsList slots={daySlots} onRemove={handleRemove} />
            </>
          )}
        </div>
      </div>
      <AddMealFAB day={WEEK_DAYS[selectedDay]} onAdd={handleAdd} />
    </AppShell>
  );
}
