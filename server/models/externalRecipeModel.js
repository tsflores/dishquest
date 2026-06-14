const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  calories: String,
  protein: String,
  carbs: String,
  fat: String,
  fiber: String,
}, { _id: false });

const externalRecipeSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceUrl: { type: String, required: true },
  sourceDomain: { type: String, default: '' },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  ingredients: [String],
  instructions: [String],
  preptime: { type: String, default: '' },
  cooktime: { type: String, default: '' },
  servings: { type: String, default: '' },
  nutrition: { type: nutritionSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

externalRecipeSchema.index({ userID: 1, sourceUrl: 1 }, { unique: true });

module.exports = mongoose.model('ExternalRecipe', externalRecipeSchema);
