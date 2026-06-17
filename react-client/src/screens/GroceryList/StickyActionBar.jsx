import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function StickyActionBar({ onGenerate, generating, disabled }) {
  return (
    <div className="fixed bottom-16 inset-x-0 md:left-20 md:bottom-0 bg-white border-t border-gray-100 p-4 z-30">
      <div className="md:max-w-4xl md:mx-auto">
        <Button variant="accent" className="w-full" onClick={onGenerate} disabled={disabled || generating}>
          {generating ? <Spinner /> : 'Generate from Meal Plan'}
        </Button>
      </div>
    </div>
  );
}
