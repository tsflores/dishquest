const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');
const CollectionService = require('../../controllers/collectionController');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    await CollectionService.ensureFavorites(req.user.id);
    const collections = await CollectionService.listForUser(req.user.id);
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const collection = await CollectionService.create(req.user.id, name);
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const collection = await CollectionService.rename(req.params.id, req.user.id, name);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    if (err.message.includes('Cannot rename')) return res.status(403).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const collection = await CollectionService.delete(req.params.id, req.user.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    if (err.message.includes('Cannot delete')) return res.status(403).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/recipes', async (req, res) => {
  try {
    const { recipeId, recipeSource, recipeName, recipeImage } = req.body;
    if (!recipeId || !recipeName) return res.status(400).json({ error: 'recipeId and recipeName are required' });
    const collection = await CollectionService.addRecipe(req.params.id, req.user.id, {
      recipeId,
      recipeSource: recipeSource || 'internal',
      recipeName,
      recipeImage: recipeImage || null,
      addedAt: new Date(),
    });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/recipes/:recipeId', async (req, res) => {
  try {
    const collection = await CollectionService.removeRecipe(req.params.id, req.user.id, req.params.recipeId);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
