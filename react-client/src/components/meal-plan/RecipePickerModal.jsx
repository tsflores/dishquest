import Modal from '../ui/Modal';
import RecipePickerList from './RecipePickerList';

export default function RecipePickerModal({ open, onClose, onPick }) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a Recipe">
      <RecipePickerList onPick={onPick} />
    </Modal>
  );
}
