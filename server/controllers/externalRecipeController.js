const mongoose = require('mongoose');
const ExternalRecipe = require('../models/externalRecipeModel');

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
}

module.exports = ExternalRecipeService;
