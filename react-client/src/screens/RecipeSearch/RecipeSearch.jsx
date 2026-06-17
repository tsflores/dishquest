import { useState, useEffect, useCallback } from 'react';
import AppShell from '../../components/layout/AppShell';
import SearchBar from './SearchBar';
import SearchToggle from './SearchToggle';
import FilterRow from './FilterRow';
import SearchResultsList from './SearchResultsList';
import { recipeService } from '../../services/recipeService';
import { edamamService, normalizeEdamamHit } from '../../services/edamamService';
import { MEAL_TYPES, CUISINE_TYPES, DIET_TYPES } from '../../utils/constants';

export default function RecipeSearch() {
  const [mode, setMode] = useState('inapp');
  const [query, setQuery] = useState('');
  const [mealType, setMealType] = useState(null);
  const [cuisineType, setCuisineType] = useState(null);
  const [diet, setDiet] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [inAppMeals, setInAppMeals] = useState([]);

  // The 64 existing recipes use free-text lowercase `meal` values (e.g. "dinner",
  // "appetizer") that don't match Edamam's capitalized mealType vocabulary, so
  // In-App filter options are derived from the real data instead of MEAL_TYPES.
  useEffect(() => {
    recipeService.list()
      .then((data) => setInAppMeals([...new Set(data.map((r) => r.meal).filter(Boolean))]))
      .catch(() => {});
  }, []);

  const runSearch = useCallback(async () => {
    if (mode === 'web' && !query.trim()) {
      setError('Enter a search term to search the web.');
      setSearched(true);
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      if (mode === 'inapp') {
        const params = {};
        if (query.trim()) params.q = query.trim();
        if (mealType) params.meal = mealType;
        const data = await recipeService.list(params);
        setResults(data.map((recipe) => ({ recipe, source: 'internal' })));
      } else {
        const params = { q: query.trim() };
        if (cuisineType) params.cuisineType = cuisineType;
        if (diet) params.diet = diet;
        if (mealType) params.mealType = mealType;
        const data = await edamamService.search(params);
        const hits = data.hits || [];
        setResults(hits.map((hit) => ({ recipe: normalizeEdamamHit(hit), source: 'external' })));
      }
    } catch (e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [mode, query, mealType, cuisineType, diet]);

  // In-app browsing reacts live to the meal filter and loads everything on mount;
  // web search requires a query, so it only runs on explicit submit.
  useEffect(() => {
    if (mode === 'inapp') runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, mealType]);

  return (
    <AppShell title="Search">
      <div className="px-4 pt-4 space-y-3 md:px-8">
        <SearchToggle
          value={mode}
          onChange={(m) => { setMode(m); setMealType(null); setResults([]); setSearched(false); setError(null); }}
        />
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={runSearch}
          placeholder={mode === 'inapp' ? 'Search saved recipes...' : 'Search the web...'}
        />
        <FilterRow
          groups={[
            { key: 'mealType', label: 'Meal', options: mode === 'inapp' ? inAppMeals : MEAL_TYPES, value: mealType, onChange: setMealType },
            ...(mode === 'web' ? [
              { key: 'cuisineType', label: 'Cuisine', options: CUISINE_TYPES, value: cuisineType, onChange: setCuisineType },
              { key: 'diet', label: 'Diet', options: DIET_TYPES, value: diet, onChange: setDiet },
            ] : []),
          ]}
        />
      </div>
      <div className="mt-4">
        <SearchResultsList results={results} loading={loading} error={error} searched={searched} mode={mode} />
      </div>
    </AppShell>
  );
}
