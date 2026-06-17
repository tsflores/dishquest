import { useState } from 'react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

export default function ActionButtons() {
  const [toast, setToast] = useState(null);

  return (
    <>
      <div className="flex gap-3 mt-3">
        <Button variant="primary" className="flex-1" onClick={() => setToast('Meal planning is coming in Phase 5')}>
          Add to Meal Plan
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => setToast('Collections are coming in Phase 4')}>
          Save to Collection
        </Button>
      </div>
      <Toast message={toast} type="info" onDismiss={() => setToast(null)} />
    </>
  );
}
