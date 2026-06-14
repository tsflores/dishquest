const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q, cuisineType, diet, health, mealType, dishType } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const params = new URLSearchParams({
    type: 'public',
    q,
    app_id: process.env.API_ID,
    app_key: process.env.API_KEY,
  });

  if (cuisineType) params.append('cuisineType', cuisineType);
  if (diet) params.append('diet', diet);
  if (health) params.append('health', health);
  if (mealType) params.append('mealType', mealType);
  if (dishType) params.append('dishType', dishType);

  const url = `https://api.edamam.com/api/recipes/v2?${params.toString()}`;

  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`Edamam API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Edamam search: "${q}"`, { cuisineType, mealType, dishType, diet, health });
    res.json(data);
  } catch (err) {
    console.error('Edamam proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from Edamam API' });
  }
});

module.exports = router;
