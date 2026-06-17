import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Spinner from '../../components/ui/Spinner';
import HeroImage from './HeroImage';
import DetailHeader from './DetailHeader';
import ActionButtons from './ActionButtons';
import DetailTabs from './DetailTabs';
import OverviewTab from './OverviewTab';
import IngredientsTab from './IngredientsTab';
import InstructionsTab from './InstructionsTab';
import { recipeService } from '../../services/recipeService';

const TAB_COMPONENTS = {
  overview: OverviewTab,
  ingredients: IngredientsTab,
  instructions: InstructionsTab,
};

export default function RecipeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const isExternal = location.pathname.startsWith('/recipe/external/');

  const [recipe, setRecipe] = useState(isExternal ? location.state?.recipe ?? null : null);
  const [loading, setLoading] = useState(!isExternal);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (isExternal) {
      if (!location.state?.recipe) {
        setError("We lost this recipe's details. Go back and open it from search again.");
      }
      return;
    }
    setLoading(true);
    setError(null);
    recipeService.get(id)
      .then(setRecipe)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isExternal, location.state]);

  const source = isExternal ? 'external' : 'internal';
  const TabComponent = TAB_COMPONENTS[tab];

  return (
    <AppShell title={recipe?.name || 'Recipe'} back hideNav>
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-forest-green w-8 h-8" />
        </div>
      ) : error ? (
        <p className="px-4 py-10 text-sm text-red-500 text-center">{error}</p>
      ) : recipe ? (
        <div>
          <HeroImage image={recipe.image} alt={recipe.name} />
          <div className="px-4 -mt-6 relative z-10">
            <DetailHeader recipe={recipe} source={source} />
            <ActionButtons recipe={recipe} source={source} />
            <DetailTabs active={tab} onChange={setTab} />
            <div className="py-4">
              <TabComponent recipe={recipe} source={source} />
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
