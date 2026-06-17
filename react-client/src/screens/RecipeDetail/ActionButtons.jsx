import { useState } from 'react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import CollectionPickerModal from '../../components/recipe/CollectionPickerModal';
import { collectionService } from '../../services/collectionService';
import { externalRecipeService } from '../../services/externalRecipeService';

export default function ActionButtons({ recipe, source }) {
  const [toast, setToast] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePick = async (collection) => {
    setSaving(true);
    setPickerOpen(false);
    try {
      // Raw Edamam search hits have no Mongo _id yet — persist them as an
      // ExternalRecipe first so the collection can reference a real ObjectId.
      let recipeId = recipe._id;
      if (source === 'external' && !recipeId) {
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
        recipeId = saved._id;
      }
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

  return (
    <>
      <div className="flex gap-3 mt-3">
        <Button variant="primary" className="flex-1" onClick={() => setToast('Meal planning is coming in Phase 5')}>
          Add to Meal Plan
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setPickerOpen(true)} disabled={saving}>
          Save to Collection
        </Button>
      </div>
      <CollectionPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={handlePick} />
      <Toast message={toast} type={toast?.startsWith('Saved') ? 'success' : 'info'} onDismiss={() => setToast(null)} />
    </>
  );
}
