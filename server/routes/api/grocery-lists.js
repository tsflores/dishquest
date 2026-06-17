const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');
const GroceryListService = require('../../controllers/groceryListController');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const lists = await GroceryListService.listForUser(req.user.id);
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const list = await GroceryListService.find(req.params.id, req.user.id);
    if (!list) return res.status(404).json({ error: 'Grocery list not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { mealPlanId } = req.body;
    if (!mealPlanId) return res.status(400).json({ error: 'mealPlanId is required' });
    const list = await GroceryListService.generateFromMealPlan(req.user.id, mealPlanId);
    if (!list) return res.status(404).json({ error: 'Meal plan not found' });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/items', async (req, res) => {
  try {
    const { name, quantity, category } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const list = await GroceryListService.addItem(req.params.id, req.user.id, { name, quantity, category });
    if (!list) return res.status(404).json({ error: 'Grocery list not found' });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/items/:itemId', async (req, res) => {
  try {
    const list = await GroceryListService.toggleItem(req.params.id, req.user.id, req.params.itemId);
    if (!list) return res.status(404).json({ error: 'Grocery list or item not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const list = await GroceryListService.removeItem(req.params.id, req.user.id, req.params.itemId);
    if (!list) return res.status(404).json({ error: 'Grocery list or item not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const list = await GroceryListService.delete(req.params.id, req.user.id);
    if (!list) return res.status(404).json({ error: 'Grocery list not found' });
    res.json({ message: 'Grocery list deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
