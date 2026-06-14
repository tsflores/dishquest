const mongoose = require('mongoose');

const collectionRecipeSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipeSource: { type: String, enum: ['internal', 'external'], default: 'internal' },
  addedAt: { type: Date, default: Date.now },
  recipeName: { type: String, required: true },
  recipeImage: { type: String, default: '' },
}, { _id: false });

const collectionSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  recipes: [collectionRecipeSchema],
  createdAt: { type: Date, default: Date.now },
});

collectionSchema.index({ userID: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
