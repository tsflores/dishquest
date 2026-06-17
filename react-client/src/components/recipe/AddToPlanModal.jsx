import { useState } from 'react';
import Modal from '../ui/Modal';
import Pill from '../ui/Pill';
import { WEEK_DAYS } from '../../utils/constants';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const TITLES = { day: 'Which day?', mealType: 'Which meal?' };
const SHORT_DAYS = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

export default function AddToPlanModal({ open, onClose, onConfirm }) {
  const [step, setStep] = useState('day');
  const [day, setDay] = useState(null);

  const reset = () => {
    setStep('day');
    setDay(null);
  };
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleMealType = (mealType) => {
    onConfirm(day, mealType);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={TITLES[step]}>
      {step === 'day' && (
        <div className="flex flex-wrap gap-2">
          {WEEK_DAYS.map((d) => (
            <Pill key={d} onClick={() => { setDay(d); setStep('mealType'); }}>
              {SHORT_DAYS[d]}
            </Pill>
          ))}
        </div>
      )}
      {step === 'mealType' && (
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((mt) => (
            <Pill key={mt} className="capitalize" onClick={() => handleMealType(mt)}>
              {mt}
            </Pill>
          ))}
        </div>
      )}
    </Modal>
  );
}
