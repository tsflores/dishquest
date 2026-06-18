import { useState, useMemo } from 'react';
import AppShell from '../../components/layout/AppShell';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import CategorySection from './CategorySection';
import StickyActionBar from './StickyActionBar';
import { useGroceryList } from '../../hooks/useGroceryList';
import { useMealPlan } from '../../hooks/useMealPlan';
import { groceryListService } from '../../services/groceryListService';
import { mealPlanService } from '../../services/mealPlanService';
import { getMondayISO } from '../../utils/weekDates';
import { GROCERY_CATEGORIES } from '../../utils/constants';

export default function GroceryList() {
  const weekStartISO = useMemo(() => getMondayISO(), []);
  const { lists, loading, reload } = useGroceryList();
  const { plans } = useMealPlan(weekStartISO);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const list = lists[0] || null;
  const plan = plans[0] || null;
  const hasMeals = (plan?.slots?.length || 0) > 0;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let planId = plan?._id;
      if (!planId) {
        const created = await mealPlanService.create(weekStartISO);
        planId = created._id;
      }
      await groceryListService.generate(planId);
      reload();
      setToast('Grocery list generated');
    } catch (e) {
      setToast(e.message || 'Could not generate grocery list');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (itemId) => {
    if (!list) return;
    await groceryListService.toggleItem(list._id, itemId);
    reload();
  };

  return (
    <AppShell title="Grocery List">
      <div className="px-4 py-6 pb-32 space-y-5 md:px-8 md:py-8">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-primary w-8 h-8" />
          </div>
        ) : !list ? (
          <p className="text-sm text-gray-400 text-center py-10">
            {hasMeals
              ? "You don't have a grocery list yet — generate one from this week's meal plan."
              : 'Plan some meals first, then generate a grocery list from them.'}
          </p>
        ) : list.items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Your grocery list is empty.</p>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-gray-900">{list.title}</h3>
            {GROCERY_CATEGORIES.map((category) => {
              const items = list.items.filter((i) => i.category === category);
              if (items.length === 0) return null;
              return (
                <CategorySection key={category} category={category} items={items} onToggle={handleToggle} />
              );
            })}
          </>
        )}
      </div>
      <StickyActionBar onGenerate={handleGenerate} generating={generating} disabled={!hasMeals} />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </AppShell>
  );
}
