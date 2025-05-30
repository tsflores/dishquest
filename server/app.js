

const express = require('express');
const path = require('node:path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const api_recipes = require('./routes/api/api-recipes');
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@clustere31.bxve7.mongodb.net/recipeApp?retryWrites=true&w=majority&appName=ClusterE31`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log('connected to database.');
})
.catch((err)=>{
  console.error(`database connection error: ${err}`);
  process.exit();
});

//middleware to add body to the request handler
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.json());

//serve up any static files in the public directory
app.use('/static', express.static(path.join(__dirname, 'public')));

//have Express automatically deliver index.html from public directory for purposes of testing API
app.use('/', express.static(path.join(__dirname, 'public')));

//set up middleware for the api route
app.use('/api/recipes', api_recipes);

app.use('/', (req, res) => {
   // filter for actual files we want to deliver from disk
   const pattern = new RegExp('(.css|.html|.js|.ico|.jpg|.png|.webp|.svg)+\/?$', 'gi'); 
   if (pattern.test(req.url)) {
      // in cases where the Angular app is mounted at the root url, we may need to strip a trailing slash from the redirected request 
      const url = req.url.replace(/\/$/, "");
      // deliver the requested file
      res.sendFile(path.resolve(__dirname, `../client/dist/dishquest/browser/${url}`));
   } else {
      // in this case, the request should be handled by Angular, which is index.html
      res.sendFile(path.resolve(__dirname, '../client/dist/dishquest/browser/index.html'));
   }
});

//custom 404 error static page middleware to serve error.html when appropriate
 app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'templates', 'error.html'));
}) 

module.exports = app;