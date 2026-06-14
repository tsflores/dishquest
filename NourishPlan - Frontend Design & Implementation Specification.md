# NourishPlan - Frontend Design & Implementation Specification

This document provides a comprehensive design specification for the **NourishPlan** meal planning application. It is intended to guide front-end development (e.g., using React, Vue, or vanilla HTML/CSS) and ensure visual consistency across all screens.

---

## 1. Design System

### 1.1 Color Palette

| Usage | Color Name | Hex Code | Description |
|---|---|---|---|
| **Primary Brand** | Forest Green | `#2D6A4F` | Used for headers, active states, primary buttons, icons, and emphasized text. |
| **Background** | Warm Cream | `#FAF3E0` | Global app background color. Provides a warm, food-friendly aesthetic. |
| **Accent / Action** | Coral Orange | `#E76F51` | Used for high-emphasis actions (e.g., "Generate Grocery List"), favorite/heart icons, and alert/delete states. |
| **Surface / Card** | Pure White | `#FFFFFF` | Used for recipe cards, bottom sheets, and modal backgrounds to create contrast against the cream background. |
| **Text - Primary** | Dark Charcoal | `#1A1A1A` | Used for primary headings, recipe titles, and main body copy. |
| **Text - Secondary**| Muted Gray | `#666666` | Used for subtitles, meta-data (time, calories), placeholder text, and inactive states. |
| **Border / Divider**| Light Gray | `#E0E0E0` | Used for subtle borders, dividers between list items, and inactive tab underlines. |
| **Success** | Leaf Green | `#4CAF50` | Used for checkmarks, progress bars, and positive states. |
| **Category - Produce**| Deep Green | `#2D6A4F` | Left border color for Produce category in Grocery List. |
| **Category - Dairy** | Mustard Yellow| `#F4A261` | Left border color for Dairy & Eggs category in Grocery List. |
| **Category - Pantry**| Earth Brown | `#A0522D` | Left border color for Pantry category in Grocery List. |
| **Category - Meat** | Brick Red | `#C1121F` | Left border color for Meat & Seafood category in Grocery List. |

### 1.2 Typography

The application uses a clean, modern sans-serif stack. 

*   **Primary Font Family:** `Inter`, `Helvetica Neue`, `Arial`, sans-serif
*   **Headings (H1, H2):** Semi-Bold or Bold, Dark Charcoal or Forest Green.
*   **Body Text:** Regular, Dark Charcoal.
*   **Meta Text (Small):** Regular, Muted Gray.

**Typography Scale:**
*   **App Title / Hero Header:** 28px - 32px, Bold
*   **Screen Title (Top Bar):** 20px, Semi-Bold
*   **Section Header:** 18px, Semi-Bold
*   **Card Title (Recipe Name):** 16px, Semi-Bold
*   **Body Copy:** 14px, Regular
*   **Small / Meta / Labels:** 12px, Regular

### 1.3 UI Elements & Styling

*   **Border Radius:** 
    *   Cards & Images: `16px` (large rounding for a friendly feel).
    *   Buttons & Pills/Chips: `24px` or fully rounded (pill shape).
*   **Shadows:**
    *   Cards: Subtle drop shadow (e.g., `box-shadow: 0 4px 12px rgba(0,0,0,0.05)`).
    *   Bottom Navigation: Stronger top shadow (e.g., `box-shadow: 0 -2px 10px rgba(0,0,0,0.08)`).
*   **Spacing (Padding/Margin):** Use an 8px grid system (8px, 16px, 24px, 32px).
    *   Standard screen edge padding: `16px` or `20px`.
    *   Gap between cards in a list/grid: `16px`.

---

## 2. Component Breakdown (Global)

### 2.1 Top Navigation Bar
*   **Height:** ~56px (excluding status bar).
*   **Background:** Transparent or matching the page background (`#FAF3E0`).
*   **Content:** Centered screen title (Forest Green). Left slot for Back Arrow or App Logo. Right slot for Actions (Search, Filter, Profile, Share).

### 2.2 Global Bottom Navigation Bar
*   **Height:** ~64px + safe area padding.
*   **Background:** Pure White (`#FFFFFF`) with top shadow.
*   **Items (5):** Home, Search, Calendar, Grocery List, Collections.
*   **States:** 
    *   **Active:** Icon and text are Forest Green (`#2D6A4F`). Icon is filled.
    *   **Inactive:** Icon and text are Muted Gray (`#666666`). Icon is outline.

### 2.3 Recipe Card (Standard Vertical)
*   **Layout:** Vertical stack. Top 60% is the image thumbnail, bottom 40% is content.
*   **Background:** White (`#FFFFFF`), `16px` border radius, subtle shadow.
*   **Content:** 
    *   Image (`object-fit: cover`, top corners rounded).
    *   Title (Bold, 16px, truncated to 1-2 lines).
    *   Cuisine Tag (Pill shape, light green background, dark green text).
    *   Meta Row: Clock icon + Time (e.g., "25 min"), Heart icon (right-aligned).

### 2.4 Recipe Card (Horizontal List Item)
*   **Layout:** Horizontal flexbox. Left side is square image, right side is content.
*   **Image:** ~100px - 120px square, `16px` border radius.
*   **Content:** Title, Tag, Rating (Stars), Time, Calories, Action Icons (Bookmark, Add).

### 2.5 Buttons
*   **Primary Button:** Solid Forest Green (`#2D6A4F`), White text, fully rounded.
*   **Accent Button:** Solid Coral Orange (`#E76F51`), White text, fully rounded.
*   **Secondary/Outline Button:** Transparent background, Forest Green border (`1px solid #2D6A4F`), Forest Green text, fully rounded.
*   **Pill / Tag:** Light gray or light green background, small text, fully rounded. Active state changes background to Forest Green and text to White.

---

## 3. Screen-by-Screen Specifications

### 3.1 Dashboard / Home
*   **Header:** App Logo + Name (left), Notification Bell + User Avatar (right).
*   **Greeting:** "Good morning, [Name]!" (Large), "What are you cooking this week?" (Subtitle).
*   **This Week's Plan:** Horizontal scrolling row of mini-cards (Image, Name, Day label, Favorite icon).
*   **Recommended For You:** 2-column grid of Standard Vertical Recipe Cards.
*   **Recently Saved:** Horizontal scrolling row of small square thumbnails with text below.

### 3.2 Recipe Search
*   **Search Input:** Large, white background, magnifying glass icon. Includes a small "Web" indicator pill inside the input on the right.
*   **Search Mode Toggle:** Segmented control (Pill shape) for "In-App" vs. "Web Search". Active state is filled green.
*   **Filter Chips:** Horizontal scrolling row of pills (All, Breakfast, Lunch, Dinner, Vegetarian, Quick).
*   **Results List:** Vertical list of Horizontal Recipe Cards.
*   **Web Badge:** Recipes sourced from the web should have a small orange "WEB" badge overlaid on the top-left of their image thumbnail.

### 3.3 Recipe Detail
*   **Hero Image:** Full width, top 35% of screen. Overlaid icons: Back (left), Share (right), Favorite Heart (right).
*   **Content Sheet:** White card overlapping the bottom of the hero image, sliding up.
*   **Header Area:** Title, Meta Chips (Time, Calories, Servings), Rating row, Cuisine Tag.
*   **Action Area:** Two buttons side-by-side (Add to Meal Plan [Primary], Save to Collection [Outline]). Below them, full-width "Generate Grocery List" button [Accent Coral].
*   **Tabs:** Overview, Ingredients, Instructions. Active tab has a Forest Green underline.
*   **Overview Content:** Description text, Nutrition Facts grid (Protein, Carbs, Fat, Fiber in small boxes), Tags list, Source link (e.g., AllRecipes.com).

### 3.4 Meal Planner (Calendar)
*   **Header Navigation:** Left/Right arrows to change week, "Today" button.
*   **Week Strip:** 7 columns (Mon-Sun). Shows day abbreviation and date number. Active/Selected day is highlighted with a filled green circle. Days with meals have a small green dot indicator.
*   **Daily Meals List:** Vertical list of cards for the selected day (e.g., Breakfast, Lunch, Dinner).
    *   **Meal Card:** Small thumbnail, Meal Type label (uppercase, green), Recipe Name, Time. Edit (pencil) and Delete (trash) icons on the right.
*   **Add Snack Button:** Dashed border, centered text "+ Add Snack".
*   **Weekly Summary:** Progress bar for calories (e.g., "1,840 / 2,000 kcal"), row of macro stats (Protein, Carbs, Fat).
*   **FAB (Floating Action Button):** Bottom right, large green circle with "+" icon, labeled "Add Meal".

### 3.5 Grocery List
*   **Header Actions:** Share icon, "Clear All" text button.
*   **Context Bar:** Text indicating source (e.g., "Generated from: Mushroom Risotto + 2 more meals") and a "Regenerate" pill button.
*   **Progress Bar:** "Items checked: X / Y" with a green fill bar.
*   **Categorized Lists:** Sections (PRODUCE, DAIRY & EGGS, PANTRY, MEAT & SEAFOOD).
    *   **Section Header:** Uppercase, bold, with a colored left border corresponding to the category (see Color Palette).
    *   **List Item:** Circular checkbox (left), Item Name (center), Quantity (right, green text).
    *   **Checked State:** Checkbox is filled green with a white checkmark. Item Name has strikethrough and muted color.
*   **Bottom Sticky Bar:** Sits above the global nav. Contains "Add Custom Item" (Primary Green) and "Share List" (Outline) buttons.

### 3.6 My Collections
*   **Header Actions:** Search icon (left), Plus icon (right) to create new collection.
*   **Filter Tabs:** Horizontal scrolling row (All, Favorites, Breakfast, Lunch, Dinner, Vegetarian).
*   **Count Text:** "X saved recipes" (Muted Gray).
*   **Collection Groups:** 
    *   **Group Header:** Icon (Heart, Moon, Sun, etc.) + TITLE (Uppercase, bold) + count. Right arrow to collapse/expand.
    *   **Group Content:** Horizontal scrolling row of vertical recipe cards.
    *   **Card Actions:** Each card has a 3-dot menu icon in the top right for actions (Remove, Move, Add to Plan).

---

## 4. Suggested Component Hierarchy (React/Vue)

```text
App/
├── Navigation/
│   ├── TopBar
│   └── BottomNavBar
├── SharedComponents/
│   ├── RecipeCardVertical
│   ├── RecipeCardHorizontal
│   ├── Pill/Chip
│   ├── Button
│   ├── Icon
│   └── ProgressBar
├── Screens/
│   ├── Dashboard/
│   │   ├── GreetingSection
│   │   ├── WeeklyPlanStrip
│   │   ├── RecommendedGrid
│   │   └── RecentlySavedRow
│   ├── RecipeSearch/
│   │   ├── SearchBar
│   │   ├── SearchToggle
│   │   ├── FilterRow
│   │   └── SearchResultsList
│   ├── RecipeDetail/
│   │   ├── HeroImage
│   │   ├── DetailHeader
│   │   ├── ActionButtons
│   │   ├── DetailTabs
│   │   └── TabContent (Overview/Ingredients/Instructions)
│   ├── MealPlanner/
│   │   ├── WeekCalendarStrip
│   │   ├── DailyMealsList
│   │   ├── MealSlotCard
│   │   ├── WeeklySummaryCard
│   │   └── FloatingActionButton
│   ├── GroceryList/
│   │   ├── ListContextBar
│   │   ├── CategorySection
│   │   ├── GroceryItemRow
│   │   └── StickyActionBottomBar
│   └── MyCollections/
│       ├── CollectionFilterTabs
│       ├── CollectionGroup
│       └── CollectionHorizontalRow
```

---

## 5. Interaction States & Notes

*   **Hover/Tap States:** Buttons and cards should have a slight opacity change or shadow increase on hover/active press.
*   **Transitions:**
    *   Navigating between bottom tabs should be an instant switch or a subtle crossfade.
    *   Opening a Recipe Detail page should ideally slide in from the right or bottom.
*   **Scrolling:** Ensure horizontal scrolling rows hide scrollbars (`::-webkit-scrollbar { display: none; }`) and use smooth momentum scrolling (`-webkit-overflow-scrolling: touch;`).
*   **Image Placeholders:** Use a warm, subtle gradient (e.g., `#E8DFCE` to `#D5C8A0`) for images before they load.

---

## 6. Out-of-Scope Notes (For Frontend Implementation)

*   **Backend / Database:** Data fetching, user authentication, and persistent storage are out of scope for this UI build. Use mock JSON data or hardcoded state.
*   **Web Search API:** The "Web Search" functionality in the Recipe Search screen does not need to connect to a real external API; simply mock the results and show the "WEB" badge.
*   **Complex Animations:** Complex page transitions or micro-interactions (like the heart icon bursting) are secondary to getting the layout and component structure correct.
*   **Responsive Desktop:** This design is explicitly for a **mobile application interface**. Desktop responsive breakpoints are out of scope; focus on mobile viewport dimensions (e.g., 375x812 or similar).
