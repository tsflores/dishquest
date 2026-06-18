import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function InstructionsTab({ recipe, source, loading }) {
  if (source === 'internal') {
    return (
      <div className="text-center py-6">
        <Button variant="primary" onClick={() => window.open(recipe.recipePDF, '_blank')}>
          View Full Recipe PDF
        </Button>
      </div>
    );
  }

  if (recipe.instructions?.length) {
    return (
      <ol className="space-y-3">
        {recipe.instructions.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-6 space-y-2">
        <Spinner className="text-primary w-6 h-6 mx-auto" />
        <p className="text-sm text-gray-400">Looking for full instructions…</p>
      </div>
    );
  }

  return (
    <div className="text-center py-6 space-y-3">
      <p className="text-sm text-gray-400">Step-by-step instructions aren't available for web recipes.</p>
      {recipe.sourceUrl && (
        <Button variant="primary" onClick={() => window.open(recipe.sourceUrl, '_blank')}>
          View Full Instructions ↗
        </Button>
      )}
    </div>
  );
}
