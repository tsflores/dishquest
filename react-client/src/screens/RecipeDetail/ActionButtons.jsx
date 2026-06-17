import { useState } from 'react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import CollectionPickerModal from '../../components/recipe/CollectionPickerModal';
import AddToPlanModal from '../../components/recipe/AddToPlanModal';
import { collectionService } from '../../services/collectionService';
import { externalRecipeService } from '../../services/externalRecipeService';
import { mealPlanService } from '../../services/mealPlanService';
import { getMondayISO } from '../../utils/weekDates';

export default function ActionButtons({ recipe, source }) {
  const [toast, setToast] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Raw Edamam search hits have no Mongo _id yet — persist them as an
  // ExternalRecipe first so the collection/meal plan can reference a real ObjectId.
  const resolveRecipeId = async () => {
    if (recipe._id) return recipe._id;
    const saved = await externalRecipeService.save({
      sourceUrl: recipe.sourceUrl,
      sourceDomain: recipe.sourceDomain,
      name: recipe.name,
      description: recipe.description,
      image: recipe.image,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      preptime: recipe.preptime,
      cooktime: recipe.cooktime,
      servings: recipe.servings,
      nutrition: recipe.nutrition,
    });
    return saved._id;
  };

  const handlePick = async (collection) => {
    setSaving(true);
    setPickerOpen(false);
    try {
      const recipeId = source === 'external' ? await resolveRecipeId() : recipe._id;
      await collectionService.addRecipe(collection._id, {
        recipeId,
        recipeSource: source,
        recipeName: recipe.name,
        recipeImage: recipe.image,
      });
      setToast(`Saved to ${collection.name}`);
    } catch (e) {
      setToast(e.message || 'Could not save recipe');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToPlan = async (day, mealType) => {
    setSaving(true);
    try {
      const recipeId = source === 'external' ? await resolveRecipeId() : recipe._id;
      const plan = await mealPlanService.create(getMondayISO());
      await mealPlanService.addSlot(plan._id, {
        day,
        mealType,
        recipeId,
        recipeSource: source,
        recipeName: recipe.name,
        recipeImage: recipe.image,
      });
      setToast(`Added to ${mealType} on ${day}`);
    } catch (e) {
      setToast(e.message || 'Could not add to meal plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex gap-3 mt-3">
        <Button variant="primary" className="flex-1" onClick={() => setPlanOpen(true)} disabled={saving}>
          Add to Meal Plan
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setPickerOpen(true)} disabled={saving}>
          Save to Collection
        </Button>
      </div>
      <CollectionPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={handlePick} />
      <AddToPlanModal open={planOpen} onClose={() => setPlanOpen(false)} onConfirm={handleAddToPlan} />
      <Toast message={toast} type={toast?.startsWith('Saved') || toast?.startsWith('Added') ? 'success' : 'info'} onDismiss={() => setToast(null)} />
    </>
  );
}
