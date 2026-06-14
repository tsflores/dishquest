const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth');
const MealPlanService = require('../../controllers/mealPlanController');

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const plans = await MealPlanService.listForUser(req.user.id, req.query.weekStart);
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plan = await MealPlanService.find(req.params.id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { weekStart } = req.body;
    if (!weekStart) return res.status(400).json({ error: 'weekStart is required' });
    const plan = await MealPlanService.create(req.user.id, weekStart);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const plan = await MealPlanService.update(req.params.id, req.user.id, req.body);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const plan = await MealPlanService.delete(req.params.id, req.user.id);
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json({ message: 'Meal plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/slots', async (req, res) => {
  try {
    const { day, mealType, recipeId, recipeSource, recipeName, recipeImage } = req.body;
    if (!day || !mealType || !recipeId || !recipeName) {
      return res.status(400).json({ error: 'day, mealType, recipeId, and recipeName are required' });
    }
    const plan = await MealPlanService.addSlot(req.params.id, req.user.id, {
      day, mealType, recipeId, recipeSource, recipeName, recipeImage,
    });
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/slots/:slotId', async (req, res) => {
  try {
    const plan = await MealPlanService.removeSlot(req.params.id, req.user.id, req.params.slotId);
    if (!plan) return res.status(404).json({ error: 'Meal plan or slot not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
