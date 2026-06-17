const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');
const ExternalRecipeService = require('../../controllers/externalRecipeController');

router.use(verifyToken);

router.get('/:id', async (req, res) => {
  try {
    const recipe = await ExternalRecipeService.find(req.params.id, req.user.id);
    if (!recipe) return res.status(404).json({ error: 'External recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { sourceUrl, name } = req.body;
    if (!sourceUrl || !name) return res.status(400).json({ error: 'sourceUrl and name are required' });
    const recipe = await ExternalRecipeService.upsert(req.user.id, req.body);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
