import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import CollectionPickerList from '../../components/recipe/CollectionPickerList';
import { scrapeService } from '../../services/scrapeService';
import { collectionService } from '../../services/collectionService';

const TITLES = {
  url: 'Import recipe from URL',
  preview: 'Recipe found',
  picker: 'Save to Collection',
};

export default function ImportUrlModal({ open, onClose, onSaved }) {
  const [step, setStep] = useState('url');
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);
  const [scraped, setScraped] = useState(null);

  const reset = () => {
    setStep('url');
    setUrl('');
    setScraped(null);
    setError(null);
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setScraping(true);
    setError(null);
    try {
      const data = await scrapeService.scrape(url.trim());
      setScraped(data);
      setStep('preview');
    } catch (e) {
      setError(e.message);
    } finally {
      setScraping(false);
    }
  };

  const handlePick = async (collection) => {
    await collectionService.addRecipe(collection._id, {
      recipeId: scraped._id,
      recipeSource: 'external',
      recipeName: scraped.name,
      recipeImage: scraped.image,
    });
    handleClose();
    onSaved();
  };

  return (
    <Modal open={open} onClose={handleClose} title={TITLES[step]}>
      {step === 'url' && (
        <div className="space-y-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/recipe"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-pantry-slate"
            autoFocus
          />
          {error && <p className="text-sm text-paprika-red bg-paprika-red/10 px-3 py-2 rounded-xl">{error}</p>}
          <Button className="w-full" onClick={handleScrape} disabled={scraping || !url.trim()}>
            {scraping ? <Spinner /> : 'Preview'}
          </Button>
        </div>
      )}

      {step === 'preview' && scraped && (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
            <p className="text-sm font-semibold text-gray-900">{scraped.name}</p>
            <p className="text-xs text-gray-500">{scraped.ingredients?.length || 0} ingredients found</p>
          </div>
          <Button className="w-full" onClick={() => setStep('picker')}>
            Save to Collection
          </Button>
        </div>
      )}

      {step === 'picker' && <CollectionPickerList onPick={handlePick} />}
    </Modal>
  );
}
