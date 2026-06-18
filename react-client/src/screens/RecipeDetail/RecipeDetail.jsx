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
import { externalRecipeService } from '../../services/externalRecipeService';

const TAB_COMPONENTS = {
  overview: OverviewTab,
  ingredients: IngredientsTab,
  instructions: InstructionsTab,
};

export default function RecipeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const isExternal = location.pathname.startsWith('/recipe/external/');

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isExternal) {
      // Persisted external recipes (saved via scrape or "Save to Collection") are
      // fetchable by id; raw Edamam search hits aren't persisted, so they only ever
      // arrive via router state from the search card click — fall back to that.
      externalRecipeService.get(id)
        .then(setRecipe)
        .catch(() => {
          if (location.state?.recipe) {
            setRecipe(location.state.recipe);
          } else {
            setError("We lost this recipe's details. Go back and open it from search again.");
          }
        })
        .finally(() => setLoading(false));
      return;
    }

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
          <Spinner className="text-pantry-slate w-8 h-8" />
        </div>
      ) : error ? (
        <p className="px-4 py-10 text-sm text-paprika-red text-center">{error}</p>
      ) : recipe ? (
        <div>
          <HeroImage image={recipe.image} alt={recipe.name} />
          <div className="px-4 -mt-6 relative z-10 md:px-8">
            <DetailHeader recipe={recipe} source={source} />
            <ActionButtons recipe={recipe} source={source} />

            {/* Phone: tab-switching, one section visible at a time */}
            <div className="md:hidden">
              <DetailTabs active={tab} onChange={setTab} />
              <div className="py-4">
                <TabComponent recipe={recipe} source={source} />
              </div>
            </div>

            {/* Tablet: overview up top, ingredients pinned alongside scrolling
                instructions so both stay visible while cooking */}
            <div className="hidden md:block py-4">
              <OverviewTab recipe={recipe} source={source} />
            </div>
            <div className="hidden md:grid md:grid-cols-[320px_1fr] md:gap-8 md:items-start md:pb-10">
              <div className="md:sticky md:top-20">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Ingredients</h3>
                <IngredientsTab recipe={recipe} source={source} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Instructions</h3>
                <InstructionsTab recipe={recipe} source={source} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
