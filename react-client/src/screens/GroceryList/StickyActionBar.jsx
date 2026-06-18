import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function StickyActionBar({ onGenerate, generating, disabled, onAddItem, onClear, hasList }) {
  return (
    <div className="fixed bottom-16 inset-x-0 md:left-20 md:bottom-0 bg-white border-t border-gray-100 p-4 z-30 space-y-2">
      <div className="md:max-w-4xl md:mx-auto space-y-2">
        <Button variant="accent" className="w-full" onClick={onGenerate} disabled={disabled || generating}>
          {generating ? <Spinner /> : 'Generate from Meal Plan'}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onAddItem}>
            Add Item
          </Button>
          {hasList && (
            <Button variant="outline" className="flex-1 !border-alert !text-alert hover:!bg-alert/5" onClick={onClear}>
              Clear List
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
