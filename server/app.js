
require('dotenv').config();
// Node's bundled DNS resolver can fall back to an unreachable 127.0.0.1
// instead of the OS-configured servers, breaking the mongodb+srv:// lookup.
require('dns').setServers(['1.1.1.1', '1.0.0.1']);
const express = require('express');
const path = require('node:path');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const api_recipes = require('./routes/api/api-recipes');
const authRoutes = require('./routes/auth/authenticate');
const edamamRoutes = require('./routes/api/edamam');
const mealPlanRoutes = require('./routes/api/meal-plans');
const groceryListRoutes = require('./routes/api/grocery-lists');
const collectionRoutes = require('./routes/api/collections');
const scrapeRoutes = require('./routes/api/scrape');
const externalRecipeRoutes = require('./routes/api/external-recipes');
const ExternalRecipeService = require('./controllers/externalRecipeController');


const app = express();

app.use(cors());

// Trust proxy for HTTPS behind reverse proxy
app.set('trust proxy', 1);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@clustere31.bxve7.mongodb.net/recipeApp?retryWrites=true&w=majority&appName=ClusterE31`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log('connected to database.');
  runMaintenance();
  setInterval(runMaintenance, 60 * 60 * 1000); // hourly
})
.catch((err)=>{
  console.error(`database connection error: ${err}`);
  process.exit();
});

// External recipes nobody saved to a collection or meal plan (e.g. just
// viewed/scraped for a preview) would otherwise accumulate forever — sweep
// orphans out periodically. Meal plans themselves are now a single
// persistent record per user with no expiry concept.
async function runMaintenance() {
  try {
    const prunedRecipes = await ExternalRecipeService.pruneAllOrphaned();
    if (prunedRecipes) {
      console.log(`Maintenance: pruned ${prunedRecipes} orphaned external recipe(s).`);
    }
  } catch (err) {
    console.error('Maintenance job error:', err.message);
  }
}

//middleware to add body to the request handler
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.json());

//serve up any static files in the public directory
app.use('/static', express.static(path.join(__dirname, 'public')));

//have Express automatically deliver index.html from public directory for purposes of testing API
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/dishquest', (req, res) => res.redirect(301, '/'));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', api_recipes);
app.use('/api/edamam', edamamRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/grocery-lists', groceryListRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/external-recipes', externalRecipeRoutes);

app.use('/', (req, res) => {
   const pattern = new RegExp('(.css|.html|.js|.json|.ico|.jpg|.png|.webp|.svg)+\/?$', 'gi');
   if (pattern.test(req.url)) {
      const url = req.url.replace(/\/$/, "");
      res.sendFile(path.resolve(__dirname, `../react-client/dist/${url}`));
   } else {
      res.sendFile(path.resolve(__dirname, '../react-client/dist/index.html'));
   }
});

//custom 404 error static page middleware to serve error.html when appropriate
 app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'templates', 'error.html'));
}) 

module.exports = app;