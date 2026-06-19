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

## Phase 4 — Collections + Web Scraping (complete)

### Collections screen
- [x] `CollectionFilterTabs.jsx` — tab row to filter by collection name, "+ New" creates a collection
- [x] `CollectionGroup.jsx` — section header + recipe list for one collection, delete (non-default only)
- [x] `CollectionHorizontalRow.jsx` — horizontal scroll row of recipe cards (moved to `components/recipe/` — shared with Dashboard's `RecentlySavedRow`)
- [x] Wire all into `Collections.jsx`

### Save to Collection flow (in RecipeDetail)
- [x] Finish `ActionButtons.jsx` — "Save to Collection" opens `CollectionPickerModal` listing user's collections with option to create new
- [x] On confirm: `POST /api/collections/:id/recipes`

### URL import / web scraping flow
- [x] `ImportUrlModal.jsx` — 3-step modal (url → preview → pick collection), accessible from Collections screen
- [x] On submit: `POST /api/scrape` → preview shows scraped recipe name + ingredient count
- [x] On confirm: save to selected collection via `POST /api/collections/:id/recipes`

### Server gap closed (not in original task list, needed for the above to work)
- [x] `server/controllers/externalRecipeController.js` + `server/routes/api/external-recipes.js` (`GET /:id`, `POST /`) — the `collectionRecipeSchema.recipeId` is a Mongo ObjectId, but raw Edamam hits and scraped pages have no DB id. `POST /api/scrape` now persists (upserts by `sourceUrl`) into `ExternalRecipe` and returns the saved doc; "Save to Collection" on a still-unsaved Edamam hit calls the same upsert via `POST /api/external-recipes` first to get a real `_id`.
- [x] `RecipeDetail.jsx` now fetches `/recipe/external/:id` via `GET /api/external-recipes/:id` first (server truth), falling back to router `state.recipe` only if not persisted (raw Edamam hit never opened before) — this is what makes clicking a saved collection card actually load the full recipe instead of just the thumbnail fields.

### Dashboard wiring
- [x] `RecentlySavedRow.jsx` wired to `GET /api/collections`, flattened + sorted by `addedAt`, latest 8

---

## Phase 5 — Meal Planner + Grocery List (complete)

### MealPlanner screen
- [x] `DailyMealsList.jsx` — list of meal slots for the selected day
- [x] `WeeklySummaryCard.jsx` — meal count summary for the week (per-meal-type breakdown + progress bar; no calorie data available — internal recipes have none and meal-plan slots only snapshot name/image, not nutrition)
- [x] `AddMealFAB.jsx` — round FAB → 2-step modal (meal type → `RecipePickerList`) → `POST /api/meal-plans/:id/slots`
- [x] Wire all into `MealPlanner.jsx` with `WeekCalendarStrip` day selector

### GroceryList screen
- [x] `CategorySection.jsx` — collapsible section per category (Produce, Dairy, Meat, Pantry, Other)
- [x] `GroceryItemRow.jsx` — item row with checkbox toggle → `PUT /api/grocery-lists/:id/items/:itemId`
- [x] `StickyActionBar.jsx` — "Generate from Meal Plan" button → `POST /api/grocery-lists/generate`
- [x] Wire all into `GroceryList.jsx`

### Dashboard wiring
- [x] Wire `WeeklyPlanPreview` to active meal plan from `GET /api/meal-plans` (reuses `CollectionHorizontalRow` — meal-plan slots already share the `{recipeId, recipeSource, recipeName, recipeImage}` shape)

### Also wired (gap from Phase 2/3 stub, natural fit for this phase)
- [x] `RecipeDetail/ActionButtons.jsx` "Add to Meal Plan" button — was a toast stub since Phase 2; now opens `AddToPlanModal` (day → meal type) and adds the current recipe (internal or external, persisting external hits via `ExternalRecipe` first, same pattern as "Save to Collection") to the current week's plan

### End-to-end test
- [x] Add recipes to meal slots → generate grocery list → check items off — verified via Playwright (signup → add 2 meals across 2 days, summary counts updated correctly → generate produced an empty list because both meals were legacy internal recipes with no structured ingredients, by design; seeded items via the API to confirm `CategorySection`/`GroceryItemRow` render and the checkbox toggle works) → also verified `RecipeDetail`'s "Add to Meal Plan" button end-to-end (day → meal type → toast)

---

## Phase 6 — PWA + Polish (complete)

- [x] Create `public/icons/icon-192.png` and `public/icons/icon-512.png` — rasterized from a new `icon.svg` (forest-green bg + the prototype's leaf/sprout mark) via ImageMagick
- [x] Implement full service worker caching strategy in `public/sw.js`:
  - App shell (HTML/JS/CSS/fonts): **Cache-first**, precache URLs injected at build
  - `/static/images/*`: **Stale-while-revalidate**
  - `/api/recipes/*`: **Network-first** with cache fallback (enables offline recipe viewing)
  - `/api/edamam/search*`: **Network-only**
  - POST / PUT / DELETE: **Pass-through**, never cached
- [x] Wire `src/scripts/inject-sw-precache.js` as `"postbuild"` script in `package.json`
- [x] Verify installable + service worker registered — Lighthouse CLI 13.4.0 has no PWA category/audits anymore, so verified manually via Playwright instead: SW controls the page after first load, manifest is valid, all three caches populate correctly, and the app fully renders offline (app shell + cached `/api/recipes` data) on reload

---

## Out-of-plan: Meal plan simplification — dropped calendar week, fixed planner not rendering (2026-06-19)

Two related issues surfaced while wrapping up Phase 7:
1. **Bug:** `GET /api/meal-plans` never returned the user's plan even though it existed in MongoDB. Root cause: the client computed `weekStart` as local-midnight-Monday and sent it as an ISO string; the server's `create()` then re-normalized that same instant using `getDay()`/`setHours()`, which run in the *server's* local timezone (UTC on the droplet) — shifting the stored `weekStart` outside the `$gte`/`$lt` window `listForUser()` queried with. Slots saved fine (hence visible directly in the DB); the list query just never matched them back. This is why "Add to Meal Plan" toasts succeeded but the planner stayed empty.
2. **Decision:** rather than patch the timezone math, dropped the calendar-week concept entirely per user request — planning happens whenever (e.g. the Friday before), with full flexibility, and slots persist until manually removed instead of auto-expiring with the week.

Changes: `mealPlanModel.js` dropped `weekStart`, added a unique index on `userID` (one persistent plan per user, slots already used generic `Monday`-`Sunday` day names, not dates — no slot-level changes needed). `mealPlanController.js`/`routes/api/meal-plans.js` simplified to `listForUser(userID)`/`create(userID)` with no date params; removed `deleteExpired()` entirely (the hourly maintenance job in `app.js` no longer sweeps "expired" plans — there's no expiry concept anymore). Client: `mealPlanService`, `useMealPlan`, `MealPlanner.jsx`, `WeeklyPlanPreview.jsx`, `GroceryList.jsx`, `ActionButtons.jsx` all dropped `weekStart`/`getMondayISO`/`formatWeekLabel`; deleted the now-fully-unused `utils/weekDates.js`. `groceryListController.js`'s list-title generation no longer reads `plan.weekStart` (was `Week of <date>`, now `Grocery List - <generated date>`).

The one existing live MealPlan document (6 slots) needed no data migration — it was already a single doc per user, so the new unique index built cleanly; the stale leftover `weekStart` field on that document is harmless and ignored by the new schema. Verified live: Playwright against the running dev server + real Atlas DB confirmed all 6 existing slots now render in the Planner, and adding a 7th via the FAB rendered immediately post-toast with no manual refresh — then removed that test slot to leave production data untouched.

---

## Out-of-plan: Expired-token requests left a raw error on screen instead of logging out (2026-06-19)

User hit "Invalid or expired token" while importing a recipe URL. JWTs expire after 24h by design — the bug was that nothing on the client noticed. `hooks/useApi.js` was built in Phase 2 to catch 401s and log out, but it was never actually imported anywhere; every service calls `apiFetch` directly, which just threw the server's raw error string for whatever component was active to display.

Fix: `apiFetch` (`services/api.js`) now clears the token and fires a `window` `'auth:unauthorized'` event on any 401. `AuthContext.jsx` listens for it and clears `user`, which `ProtectedRoute.jsx` already turns into a redirect to `/login` — no new routing needed. Deleted the dead `useApi.js`. Verified via Playwright: a token that expires mid-session now bounces the in-progress action (URL import) straight to `/login` instead of leaving the raw error in the modal.

---

## Phase 7 — Production Deployment + Cleanup

### Prep
- [x] Create `ecosystem.config.js` at repo root — named `dishquest` (matches the existing pm2 process being replaced and `server/package.json`'s name), `cwd` set to `server/` so `dotenv` still finds `server/.env` (it resolves relative to `process.cwd()`, not the script's location), log paths built from `__dirname` so they always land in `<repo root>/logs/` regardless of where `pm2 start` is run from. Smoke-tested locally with a real `pm2 start` — DB connected, server listened on 3000, `/api/recipes` returned 200, logs landed correctly.

### Droplet deploy sequence
```bash
git fetch && git checkout nourish-plan
cd server && npm install
cd ../react-client && npm install && npm run build
cd ..
pm2 stop dishquest && pm2 delete dishquest
pm2 start ecosystem.config.js --env production
pm2 save
```
**Note:** the original version of this sequence was missing the `cd ..` after the react-client build — without it you're still inside `react-client/` when the `pm2` commands run, and `ecosystem.config.js` (at repo root) won't be found.

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
