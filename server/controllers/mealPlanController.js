const MealPlan = require('../models/mealPlanModel');
const ExternalRecipeService = require('./externalRecipeController');

class MealPlanService {
  // One persistent plan per user — no calendar week, just generic
  // Monday-Sunday slots the user adds to and removes from as needed.
  static async listForUser(userID) {
    return MealPlan.find({ userID });
  }

  static async find(id, userID) {
    return MealPlan.findOne({ _id: id, userID });
  }

  static async create(userID) {
    const existing = await MealPlan.findOne({ userID });
    if (existing) return existing;

    const plan = new MealPlan({ userID, slots: [] });
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

}

module.exports = MealPlanService;
