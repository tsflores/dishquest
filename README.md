# DishQuest

DishQuest is a mobile-first recipe and meal-planning PWA. Search recipes (in-app or via Edamam web search), import any recipe from a URL, organize favorites into collections, build a weekly meal plan, and generate a categorized grocery list from it — installable as a standalone app with offline support for previously viewed recipes.

The original Angular frontend has been replaced with a React + Tailwind CSS PWA (`react-client/`). The Express/MongoDB backend (`server/`) was kept and extended rather than rewritten.

## Live Demo
[DishQuest](https://recipecollection.trinidads-portfolio.com/)

## Features

- User authentication (JWT)
- Recipe search — in-app (the existing recipe collection) or web search via the Edamam API
- Import any recipe by pasting its URL (scrapes structured recipe data via schema.org JSON-LD, with a heuristic fallback)
- Save recipes to custom collections (a default Favorites collection is created automatically)
- Weekly meal planner — add recipes to a day/meal-type slot; plan however far ahead you like, slots persist until removed
- Auto-generate a categorized grocery list (Produce / Dairy / Meat / Pantry / Other) from a meal plan, or add items manually
- Installable PWA with offline support for previously viewed recipes and app shell
- Responsive layout: bottom tab navigation on phone, sidebar + split-pane recipe view on tablet/desktop

## Architecture

```
dishquest/
├── server/         Express REST API + MongoDB (Mongoose). Auth, recipes, meal plans,
│                   collections, grocery lists, URL scraping, and an Edamam search proxy.
│                   Serves the built react-client as static files in production.
├── react-client/    Active frontend — React 18 + Vite + Tailwind CSS PWA.
└── client/          Legacy Angular frontend — kept in the repo for reference but no
                     longer built or served. Do not develop against this directory.
```

## Prerequisites

- Node.js v18+ (server uses native `fetch`)
- npm
- A MongoDB Atlas cluster
- An [Edamam](https://developer.edamam.com/) Recipe Search API app ID/key (for web search)

## Setup

### Server

```bash
cd server
npm install
```

Create `server/.env`:
```env
DB_USER=your_MongoDB_username
DB_PWD=your_MongoDB_password
JWT_SECRET=your_secret_string
PORT=3000
API_ID=your_Edamam_app_id
API_KEY=your_Edamam_app_key
```

Update the MongoDB Atlas connection string in `server/app.js` (`mongoose.connect(...)`) to point at your own cluster — only the credentials come from `.env`.

Create `server/public/images` and `server/public/pdfs` to hold uploaded recipe images and PDFs.

```bash
npm run start-dev   # nodemon, hot reload
# or
npm start           # production
```
Server listens on `http://localhost:3000`.

### Client (react-client)

```bash
cd react-client
npm install
npm run dev          # dev server at http://localhost:5173, proxies /api and /static to localhost:3000
```

```bash
npm run build        # production build to react-client/dist/
```

### Full production build

```bash
cd react-client && npm install && npm run build
cd ../server && npm install && npm start
```
The Express server at `localhost:3000` serves both the API and the built React PWA.

## Technologies Used

- **Frontend:** React 18, React Router, Vite, Tailwind CSS, a hand-rolled service worker (no build-tool PWA plugin)
- **Backend:** Node.js / Express, MongoDB / Mongoose, JWT auth, Multer (file uploads), Cheerio + Axios (recipe URL scraping)
- **External API:** Edamam Recipe Search API (proxied server-side so API credentials never reach the client)
- **Legacy:** Angular 19 + Bootstrap Icons (`client/` — superseded, not in active use)

## Contact

For questions or feedback, please open an issue in the repository.
