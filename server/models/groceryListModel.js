const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Produce', 'Dairy', 'Pantry', 'Meat', 'Other'],
    default: 'Other',
  },
  checked: { type: Boolean, default: false },
}, { _id: true });

const groceryListSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', default: null },
  title: { type: String, default: 'Grocery List' },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

groceryListSchema.index({ userID: 1, createdAt: -1 });

groceryListSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('GroceryList', groceryListSchema);
