const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q, cuisineType, diet, health, mealType, dishType, cont } = req.query;

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
  if (cont) params.append('_cont', cont);

  const url = `https://api.edamam.com/api/recipes/v2?${params.toString()}`;

  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`Edamam API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Edamam search: "${q}"`, { cuisineType, mealType, dishType, diet, health, cont: !!cont });

    // Edamam's _links.next.href embeds app_id/app_key — never forward it to the
    // client. Extract just the opaque _cont cursor so the client can ask for the
    // next page without ever seeing the credentials.
    const nextHref = data._links && data._links.next && data._links.next.href;
    let nextCont = null;
    if (nextHref) {
      try {
        nextCont = new URL(nextHref).searchParams.get('_cont');
      } catch {
        nextCont = null;
      }
    }
    delete data._links;

    res.json({ ...data, nextCont });
  } catch (err) {
    console.error('Edamam proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from Edamam API' });
  }
});

module.exports = router;
