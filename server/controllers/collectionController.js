const Collection = require('../models/collectionModel');
const ExternalRecipeService = require('./externalRecipeController');

class CollectionService {
  static async listForUser(userID) {
    return Collection.find({ userID }).sort({ isDefault: -1, createdAt: 1 });
  }

  static async find(id, userID) {
    return Collection.findOne({ _id: id, userID });
  }

  static async ensureFavorites(userID) {
    let fav = await Collection.findOne({ userID, isDefault: true });
    if (!fav) {
      fav = await new Collection({ userID, name: 'Favorites', isDefault: true, recipes: [] }).save();
    }
    return fav;
  }

  static async create(userID, name) {
    const collection = new Collection({ userID, name, recipes: [] });
    return collection.save();
  }

  static async rename(id, userID, name) {
    const collection = await Collection.findOne({ _id: id, userID });
    if (!collection) return null;
    if (collection.isDefault) throw new Error('Cannot rename the Favorites collection');
    collection.name = name;
    return collection.save();
  }

  static async delete(id, userID) {
    const collection = await Collection.findOne({ _id: id, userID });
    if (!collection) return null;
    if (collection.isDefault) throw new Error('Cannot delete the Favorites collection');
    const externalIds = collection.recipes
      .filter((r) => r.recipeSource === 'external')
      .map((r) => r.recipeId);
    const deleted = await Collection.findOneAndDelete({ _id: id, userID });
    for (const recipeId of externalIds) await ExternalRecipeService.deleteIfOrphaned(recipeId);
    return deleted;
  }

  static async addRecipe(id, userID, recipeEntry) {
    const collection = await Collection.findOne({ _id: id, userID });
    if (!collection) return null;

    const alreadyIn = collection.recipes.some(
      (r) => r.recipeId.toString() === recipeEntry.recipeId.toString() && r.recipeSource === recipeEntry.recipeSource
    );
    if (!alreadyIn) {
      collection.recipes.push(recipeEntry);
      await collection.save();
    }
    return collection;
  }

  static async removeRecipe(id, userID, recipeId) {
    const collection = await Collection.findOne({ _id: id, userID });
    if (!collection) return null;
    const removed = collection.recipes.find((r) => r.recipeId.toString() === recipeId);
    collection.recipes = collection.recipes.filter((r) => r.recipeId.toString() !== recipeId);
    await collection.save();
    if (removed?.recipeSource === 'external') {
      await ExternalRecipeService.deleteIfOrphaned(removed.recipeId);
    }
    return collection;
  }
}

module.exports = CollectionService;
