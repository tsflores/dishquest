# NourishPlan — Remaining Work by Phase

Phases 1, 2, and 3 are complete. This file tracks what's left.

---

## Phase 3 — Recipe Search and Detail (complete)

### RecipeSearch screen
- [x] `SearchBar.jsx`
- [x] `SearchToggle.jsx` — segmented control: In-App / Web
- [x] `FilterRow.jsx` — horizontal pill row for cuisine, meal type, diet, etc.
- [x] `SearchResultsList.jsx` — renders `RecipeCardVertical` grid
- [x] Wire all into `RecipeSearch.jsx` — In-App toggle hits `GET /api/recipes?q=...`, Web toggle hits `GET /api/edamam/search?q=...`
  - Note: in-app `meal` filter pills are derived from the real (lowercase, free-text) `meal` values in the data, not the `MEAL_TYPES` constant — that constant matches Edamam's capitalized vocabulary, which doesn't overlap with the legacy dataset.

### RecipeDetail screen
- [x] `HeroImage.jsx`
- [x] `DetailHeader.jsx` — name, chef/source, prep/cook time
- [x] `ActionButtons.jsx` — "Add to Meal Plan" / "Save to Collection" (stub buttons show a toast; wired in Phase 4/5)
- [x] `DetailTabs.jsx` — Overview / Ingredients / Instructions tab switcher
- [x] `OverviewTab.jsx` — description, nutrition grid + source link for external recipes
- [x] `IngredientsTab.jsx` — for in-app recipes: "Ingredients are in the recipe PDF"; for external: full list
- [x] `InstructionsTab.jsx` — for in-app recipes: "View Full Recipe PDF" link; for external: step list if present, else "View Full Instructions" link to the source site (Edamam has no step data)
- [x] Wire all into `RecipeDetail.jsx` — handles both `/recipe/:id` (internal, fetched via `recipeService.get`) and `/recipe/external/:id` (Edamam result, passed via router `state` from the search card click — Edamam has no get-by-id endpoint, so direct navigation/refresh shows a friendly "go back to search" message)

### Dashboard
- [x] `GreetingSection.jsx` — time-of-day greeting with user name
- [x] `RecommendedGrid.jsx` — 2-col grid, random slice of in-app recipes via `GET /api/recipes`
- [x] `WeeklyPlanPreview.jsx` — placeholder (wired to real data in Phase 5)
- [x] `RecentlySavedRow.jsx` — placeholder (wired to real data in Phase 4)
- [x] Wire all into `Dashboard.jsx`

---

## Phase 4 — Collections + Web Scraping

### Collections screen
- [ ] `CollectionFilterTabs.jsx` — tab row to filter by collection name
- [ ] `CollectionGroup.jsx` — section header + recipe list for one collection
- [ ] `CollectionHorizontalRow.jsx` — horizontal scroll row of recipe cards
- [ ] Wire all into `Collections.jsx`

### Save to Collection flow (in RecipeDetail)
- [ ] Finish `ActionButtons.jsx` — "Save to Collection" opens a modal listing user's collections with option to create new
- [ ] On confirm: `POST /api/collections/:id/recipes`

### URL import / web scraping flow
- [ ] URL input modal (accessible from Collections screen)
- [ ] On submit: `POST /api/scrape` → show preview of scraped recipe name + ingredient count
- [ ] On confirm: save to selected collection via `POST /api/collections/:id/recipes`

### Dashboard wiring
- [ ] Wire `RecentlySavedRow` to real collection data from `GET /api/collections`

---

## Phase 5 — Meal Planner + Grocery List

### MealPlanner screen
- [ ] `DailyMealsList.jsx` — list of meal slots for the selected day
- [ ] `WeeklySummaryCard.jsx` — calorie/meal count summary for the week
- [ ] `AddMealFAB.jsx` — floating action button → opens recipe picker → `POST /api/meal-plans/:id/slots`
- [ ] Wire all into `MealPlanner.jsx` with `WeekCalendarStrip` day selector

### GroceryList screen
- [ ] `CategorySection.jsx` — collapsible section per category (Produce, Dairy, Meat, Pantry, Other)
- [ ] `GroceryItemRow.jsx` — item row with checkbox toggle → `PUT /api/grocery-lists/:id/items/:itemId`
- [ ] `StickyActionBar.jsx` — "Generate from Meal Plan" button → `POST /api/grocery-lists/generate`
- [ ] Wire all into `GroceryList.jsx`

### Dashboard wiring
- [ ] Wire `WeeklyPlanPreview` to active meal plan from `GET /api/meal-plans`

### End-to-end test
- [ ] Add recipes to meal slots → generate grocery list → check items off

---

## Phase 6 — PWA + Polish

- [ ] Create `public/icons/icon-192.png` and `public/icons/icon-512.png`
- [ ] Implement full service worker caching strategy in `public/sw.js`:
  - App shell (HTML/JS/CSS/fonts): **Cache-first**, precache URLs injected at build
  - `/static/images/*`: **Stale-while-revalidate**
  - `/api/recipes/*`: **Network-first** with cache fallback (enables offline recipe viewing)
  - `/api/edamam/search*`: **Network-only**
  - POST / PUT / DELETE: **Pass-through**, never cached
- [ ] Wire `src/scripts/inject-sw-precache.js` as `"postbuild"` script in `package.json`
- [ ] Run Lighthouse PWA audit in Chrome — verify installable + service worker registered

---

## Phase 7 — Production Deployment + Cleanup

### Prep
- [ ] Create `ecosystem.config.js` at repo root (see plan file for full config)

### Droplet deploy sequence
```bash
git fetch && git checkout nourish-plan
cd server && npm install
cd ../react-client && npm install && npm run build
pm2 stop dishquest && pm2 delete dishquest
pm2 start ecosystem.config.js --env production
pm2 save
```

### Verify
- [ ] HTTPS resolves at `https://recipe-collection.trinidads-portfolio.com/`
- [ ] All 64 PDFs resolve at `/static/pdfs/<filename>.pdf`
- [ ] `/dishquest` redirects to `/`
- [ ] Login / signup flow works end-to-end
- [ ] Edamam search returns results
- [ ] `POST /api/scrape` with a real recipe URL returns structured data
- [ ] Adding a recipe to a meal plan slot persists
- [ ] Generating a grocery list from a meal plan populates categorized items
- [ ] Lighthouse PWA score passes (installable, service worker active)

### Cleanup
- [ ] Delete `server/edamam-app.js`
- [ ] Optionally remove `client/dist/` from the branch
