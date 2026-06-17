import Modal from '../ui/Modal';
import CollectionPickerList from './CollectionPickerList';

export default function CollectionPickerModal({ open, onClose, onPick }) {
  return (
    <Modal open={open} onClose={onClose} title="Save to Collection">
      <CollectionPickerList onPick={onPick} />
    </Modal>
  );
}
