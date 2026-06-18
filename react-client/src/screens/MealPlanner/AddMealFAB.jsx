import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Pill from '../../components/ui/Pill';
import RecipePickerList from '../../components/meal-plan/RecipePickerList';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const TITLES = { mealType: 'Add a Meal', recipe: 'Choose a Recipe' };

export default function AddMealFAB({ day, onAdd }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('mealType');
  const [mealType, setMealType] = useState(null);

  const reset = () => {
    setStep('mealType');
    setMealType(null);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handlePick = (recipe) => {
    onAdd(mealType, recipe);
    handleClose();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 z-30 w-14 h-14 rounded-full bg-accent text-white text-3xl leading-none flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label={`Add meal for ${day}`}
      >
        +
      </button>

      <Modal open={open} onClose={handleClose} title={TITLES[step]}>
        {step === 'mealType' && (
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map((mt) => (
              <Pill key={mt} className="capitalize" onClick={() => { setMealType(mt); setStep('recipe'); }}>
                {mt}
              </Pill>
            ))}
          </div>
        )}
        {step === 'recipe' && <RecipePickerList onPick={handlePick} />}
      </Modal>
    </>
  );
}
