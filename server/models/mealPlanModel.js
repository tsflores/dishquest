const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  recipeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipeSource: { type: String, enum: ['internal', 'external'], default: 'internal' },
  recipeName: { type: String, required: true },
  recipeImage: { type: String, default: '' },
}, { _id: true });

const mealPlanSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  weekStart: { type: Date, required: true },
  slots: [slotSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mealPlanSchema.index({ userID: 1, weekStart: 1 });

mealPlanSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
