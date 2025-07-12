const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//create a new schema for user favorites that makes use of Recipe and User models
const userFavoriteSchema = new Schema({
    userID:{type: Schema.Types.ObjectId, ref: 'Users', required: true},
    recipeID:{type: Schema.Types.ObjectId, ref: 'Recipe', required: true},
    createdAt: {type: Date, default: Date.now}
});

// Ensure a user can't favorite the same recipe twice
userFavoriteSchema.index({ userID: 1, recipeID: 1 }, { unique: true });

// Index for efficient queries
userFavoriteSchema.index({ userID: 1, createdAt: -1 }); // Get user favorites sorted by date
userFavoriteSchema.index({ recipeID: 1 }); // Get users who favorited a recipe

module.exports = mongoose.model("UserFavorite", userFavoriteSchema);