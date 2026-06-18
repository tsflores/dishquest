import { useState } from 'react';
import Pill from '../../components/ui/Pill';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { collectionService } from '../../services/collectionService';

export default function CollectionFilterTabs({ collections, active, onChange, onCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const collection = await collectionService.create(name.trim());
      setName('');
      setOpen(false);
      onCreated(collection);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Pill active={active === null} onClick={() => onChange(null)}>All</Pill>
        {collections.map((c) => (
          <Pill key={c._id} active={active === c._id} onClick={() => onChange(c._id)}>
            {c.name}
          </Pill>
        ))}
        <Pill onClick={() => setOpen(true)}>+ New</Pill>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Collection">
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection name"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pantry-slate"
            autoFocus
          />
          <Button className="w-full" onClick={handleCreate} disabled={creating || !name.trim()}>
            {creating ? <Spinner /> : 'Create'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
