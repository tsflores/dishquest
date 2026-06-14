# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

DishQuest is a recipe community app with a decoupled architecture:

- **`/server`** — Express.js REST API with MongoDB (Mongoose). Handles all data persistence, file uploads, and auth. In production, also serves the compiled Angular frontend.
- **`/client`** — Angular 19 SPA (standalone component pattern, no NgModules). Talks to the server API for all data.

In production, `server/app.js` serves the Angular build from `client/dist/dishquest/browser/` as static files. The Angular router handles client-side navigation; unmatched routes fall through to `index.html`.

### Server internals

```
server/
  app.js                        # Express app setup, MongoDB connection, route mounting
  bin/www                       # HTTP server entry point; defaults to port 3000
  routes/api/api-recipes.js     # Recipe CRUD + favorites endpoints mounted at /api/recipes
  routes/auth/authenticate.js   # Auth endpoints mounted at /api/auth
  controllers/recipeController.js  # RecipeService static class + multer storage/filter config
  controllers/userController.js    # AuthController (register/login)
  models/recipeModel.js         # Recipe Mongoose schema
  models/userModel.js           # User schema with bcrypt pre-save hook
  models/userFavoritesModel.js  # Join model (userID + recipeID) with unique compound index
  public/images/                # Uploaded recipe images (served at /static/images/)
  public/pdfs/                  # Uploaded recipe PDFs (served at /static/pdfs/)
```

File uploads use multer with disk storage. Images go to `public/images/`, PDFs go to `public/pdfs/`. The stored path (e.g. `/static/images/filename.jpg`) is saved directly to the Recipe document.

Auth uses JWT signed with `JWT_SECRET`. Tokens are returned on login; the client stores them in `localStorage` and decodes the payload client-side to get user info (no `/me` endpoint).

### Client internals

```
client/src/
  environments/environment.ts       # Dev: apiurl points to remote server, authBaseURL to localhost:3000
  environments/environment.prod.ts  # Prod: apiurl is '/', authBaseURL is '/api/auth'
  app/interfaces.ts                 # Shared TypeScript interfaces (Recipe, User, AuthResponse, etc.)
  app/recipe.service.ts             # RecipeService — all recipe + favorites HTTP calls
  app/auth.service.ts               # AuthService — login/register/logout, JWT decode, BehaviorSubject for current user
  app/app.config.ts                 # provideRouter(routes) wired here
```

All components are standalone. `AuthService.currentUser$` is a `BehaviorSubject<User | null>` that components subscribe to for reactive auth state.

The Angular Material theme in use is `magenta-violet` (`angular.json`). Bootstrap Icons is included for icon classes.

## Environment Setup

The server needs a `server/.env` file with:
```
DB_USER=<mongodb-username>
DB_PWD=<mongodb-password>
JWT_SECRET=<secret>
PORT=3000
```

MongoDB Atlas connection string is hardcoded in `server/app.js` — only credentials come from env vars.

## Commands

### Server
```bash
cd server
npm install
npm start           # production
npm run start-dev   # nodemon with --inspect for hot reload
```

### Client
```bash
cd client
npm install
ng serve            # dev server at localhost:4200
ng build            # build to client/dist/dishquest/browser/
ng test             # Karma/Jasmine unit tests
```

To run a single test file:
```bash
cd client
ng test --include='**/recipe.service.spec.ts'
```

### Full production build
```bash
cd client && ng build
cd ../server && npm start
```
The Express server at `localhost:3000` then serves both the API and the Angular app.

## Key Patterns

**RecipeService (server)** is a static-method class (`recipeController.js`). All DB operations go through it — do not query Mongoose models directly in route handlers.

**Favorites** are stored in a separate `UserFavorite` collection (not as a field on Recipe). This allows per-user favorites without mutating shared recipe documents.

**CORS headers** are set per-router in each route file (not globally in `app.js`). Both `/api/recipes` and `/api/auth` routers set their own headers.

**Angular routing** — routes are defined in `app.routes.ts` and registered via `provideRouter()` in `app.config.ts`. The Express catch-all in `app.js` forwards non-asset requests to Angular's `index.html` to support client-side routing.

**Development environment quirk** — `environment.ts` (dev) sets `apiurl` to a remote IP (`104.131.189.144:8080`) and `authBaseURL` to `localhost:3000`. If developing locally against a local server, update `environment.ts` to point both at `http://localhost:3000/`.
