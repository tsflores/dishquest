const GroceryList = require('../models/groceryListModel');
const MealPlan = require('../models/mealPlanModel');
const Recipe = require('../models/recipeModel');
const ExternalRecipe = require('../models/externalRecipeModel');

const PRODUCE_KEYWORDS = ['lettuce', 'tomato', 'tomatoes', 'apple', 'apples', 'onion', 'onions', 'garlic', 'pepper', 'peppers', 'spinach', 'carrot', 'carrots', 'celery', 'cucumber', 'zucchini', 'broccoli', 'cauliflower', 'mushroom', 'mushrooms', 'lemon', 'lime', 'orange', 'oranges', 'potato', 'potatoes', 'sweet potato', 'ginger', 'herbs', 'basil', 'cilantro', 'parsley', 'thyme', 'rosemary', 'avocado', 'berry', 'berries', 'banana', 'grapes', 'mango', 'kale', 'arugula'];
const DAIRY_KEYWORDS = ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'egg', 'eggs', 'sour cream', 'heavy cream', 'parmesan', 'mozzarella', 'cheddar', 'ricotta', 'cream cheese', 'half and half'];
const MEAT_KEYWORDS = ['chicken', 'beef', 'pork', 'salmon', 'tuna', 'shrimp', 'turkey', 'lamb', 'bacon', 'sausage', 'ham', 'steak', 'ground beef', 'ground turkey', 'fish', 'tilapia', 'cod', 'scallops', 'crab', 'lobster'];

function categorize(ingredientName) {
  const lower = ingredientName.toLowerCase();
  if (PRODUCE_KEYWORDS.some((k) => lower.includes(k))) return 'Produce';
  if (DAIRY_KEYWORDS.some((k) => lower.includes(k))) return 'Dairy';
  if (MEAT_KEYWORDS.some((k) => lower.includes(k))) return 'Meat';
  return 'Pantry';
}

class GroceryListService {
  static async listForUser(userID) {
    return GroceryList.find({ userID }).sort({ createdAt: -1 });
  }

  static async find(id, userID) {
    return GroceryList.findOne({ _id: id, userID });
  }

  static async generateFromMealPlan(userID, mealPlanId) {
    const plan = await MealPlan.findOne({ _id: mealPlanId, userID });
    if (!plan) return null;

    const items = [];

    for (const slot of plan.slots) {
      let ingredients = [];
      if (slot.recipeSource === 'external') {
        const ext = await ExternalRecipe.findById(slot.recipeId);
        if (ext) ingredients = ext.ingredients;
      } else {
        // Internal recipes store ingredients in description; no structured list
        // Leave items empty — user can add manually
      }

      for (const ingredient of ingredients) {
        items.push({
          name: ingredient,
          quantity: '',
          category: categorize(ingredient),
          checked: false,
        });
      }
    }

    const list = new GroceryList({
      userID,
      mealPlanId,
      title: `Week of ${plan.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      items,
    });
    return list.save();
  }

  static async create(userID, title) {
    const list = new GroceryList({ userID, title: title || 'Grocery List', items: [] });
    return list.save();
  }

  static async addItem(id, userID, item) {
    const list = await GroceryList.findOne({ _id: id, userID });
    if (!list) return null;
    list.items.push({
      name: item.name,
      quantity: item.quantity || '',
      category: item.category || categorize(item.name),
      checked: false,
    });
    return list.save();
  }

  static async toggleItem(id, userID, itemId) {
    const list = await GroceryList.findOne({ _id: id, userID });
    if (!list) return null;
    const item = list.items.id(itemId);
    if (!item) return null;
    item.checked = !item.checked;
    return list.save();
  }

  static async removeItem(id, userID, itemId) {
    const list = await GroceryList.findOne({ _id: id, userID });
    if (!list) return null;
    list.items = list.items.filter((i) => i._id.toString() !== itemId);
    return list.save();
  }

  static async delete(id, userID) {
    return GroceryList.findOneAndDelete({ _id: id, userID });
  }
}

module.exports = GroceryListService;
