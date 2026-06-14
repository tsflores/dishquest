import express from 'express';
import dotenv from 'dotenv';
//import path from 'node:path';

dotenv.config();

console.log('API_ID:', process.env.API_ID);
console.log('API_KEY:', process.env.API_KEY);

const app = express();
const PORT = process.env.PORT || 5500;

// CORS middleware - must come before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.json());


app.get('/api/recipes/search', async (req, res) => {
  const {q, cuisineType, diet, health, mealType, dishType} = req.query

  if(!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const baseURL = 'https://api.edamam.com/api/recipes/v2';
  const params = new URLSearchParams({
    type: 'public',
    q: q,
    app_id: process.env.API_ID,
    app_key: process.env.API_KEY,
  });

  if(cuisineType) params.append('cuisineType', cuisineType);
  if(diet) params.append('diet', diet);
  if(health) params.append('health', health);
  if(mealType) params.append('mealType', mealType);
  if(dishType) params.append('dishType', dishType);


  const url = `${baseURL}?${params.toString()}`;

  console.log('API Request URL:', url);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
    });

    if(!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    
    console.log(`Query: ${q}, Filters:`, { cuisineType, mealType, dishType, diet, health });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from API' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});