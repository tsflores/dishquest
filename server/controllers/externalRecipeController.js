const mongoose = require('mongoose');
const ExternalRecipe = require('../models/externalRecipeModel');
const Collection = require('../models/collectionModel');
const MealPlan = require('../models/mealPlanModel');

class ExternalRecipeService {
  static async find(id, userID) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return ExternalRecipe.findOne({ _id: id, userID });
  }

  static async upsert(userID, data) {
    const existing = await ExternalRecipe.findOne({ userID, sourceUrl: data.sourceUrl });
    if (existing) return existing;
    return new ExternalRecipe({ ...data, userID }).save();
  }

  static async isReferenced(recipeId) {
    const inCollection = await Collection.exists({
      recipes: { $elemMatch: { recipeId, recipeSource: 'external' } },
    });
    if (inCollection) return true;
    const inPlan = await MealPlan.exists({
      slots: { $elemMatch: { recipeId, recipeSource: 'external' } },
    });
    return !!inPlan;
  }

  // A scraped/viewed recipe is only worth keeping once something actually
  // references it (a collection or meal plan slot) — otherwise it's just
  // clutter from someone looking at a search result.
  static async deleteIfOrphaned(recipeId) {
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) return;
    const referenced = await ExternalRecipeService.isReferenced(recipeId);
    if (!referenced) {
      await ExternalRecipe.findByIdAndDelete(recipeId);
    }
  }

  // Safety-net sweep for orphans that were never referenced in the first
  // place (e.g. scraped for a preview/instructions backfill, then abandoned)
  // — the targeted deleteIfOrphaned calls only fire on removal events.
  static async pruneAllOrphaned() {
    const fromCollections = await Collection.distinct('recipes.recipeId', { 'recipes.recipeSource': 'external' });
    const fromPlans = await MealPlan.distinct('slots.recipeId', { 'slots.recipeSource': 'external' });
    const referenced = [...fromCollections, ...fromPlans];
    const result = await ExternalRecipe.deleteMany({ _id: { $nin: referenced } });
    return result.deletedCount;
  }
}

module.exports = ExternalRecipeService;
