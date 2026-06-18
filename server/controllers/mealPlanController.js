const MealPlan = require('../models/mealPlanModel');
const ExternalRecipeService = require('./externalRecipeController');

class MealPlanService {
  static async listForUser(userID, weekStart) {
    const query = { userID };
    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      query.weekStart = { $gte: start, $lt: end };
    }
    return MealPlan.find(query).sort({ weekStart: -1 });
  }

  static async find(id, userID) {
    return MealPlan.findOne({ _id: id, userID });
  }

  static async create(userID, weekStart) {
    const date = new Date(weekStart);
    // Normalize to Monday of the given week
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);

    const existing = await MealPlan.findOne({ userID, weekStart: date });
    if (existing) return existing;

    const plan = new MealPlan({ userID, weekStart: date, slots: [] });
    return plan.save();
  }

  static async addSlot(mealPlanId, userID, slot) {
    const plan = await MealPlan.findOne({ _id: mealPlanId, userID });
    if (!plan) return null;
    plan.slots.push(slot);
    return plan.save();
  }

  static async removeSlot(mealPlanId, userID, slotId) {
    const plan = await MealPlan.findOne({ _id: mealPlanId, userID });
    if (!plan) return null;
    const removed = plan.slots.find((s) => s._id.toString() === slotId);
    plan.slots = plan.slots.filter((s) => s._id.toString() !== slotId);
    await plan.save();
    if (removed?.recipeSource === 'external') {
      await ExternalRecipeService.deleteIfOrphaned(removed.recipeId);
    }
    return plan;
  }

  static async update(id, userID, data) {
    return MealPlan.findOneAndUpdate({ _id: id, userID }, data, { new: true });
  }

  static async delete(id, userID) {
    const plan = await MealPlan.findOne({ _id: id, userID });
    if (!plan) return null;
    const externalIds = plan.slots
      .filter((s) => s.recipeSource === 'external')
      .map((s) => s.recipeId);
    const deleted = await MealPlan.findOneAndDelete({ _id: id, userID });
    for (const recipeId of externalIds) await ExternalRecipeService.deleteIfOrphaned(recipeId);
    return deleted;
  }

  // A meal plan is only useful for its own week — once a new week starts,
  // last week's plan (and any external recipes only referenced by it) should
  // go away automatically rather than accumulate forever.
  static async deleteExpired() {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const expiring = await MealPlan.find({ weekStart: { $lt: monday } });
    for (const plan of expiring) {
      const externalIds = plan.slots
        .filter((s) => s.recipeSource === 'external')
        .map((s) => s.recipeId);
      await MealPlan.deleteOne({ _id: plan._id });
      for (const recipeId of externalIds) await ExternalRecipeService.deleteIfOrphaned(recipeId);
    }
    return expiring.length;
  }
}

module.exports = MealPlanService;
