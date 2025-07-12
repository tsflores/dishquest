const multer = require("multer");
const Recipe = require("../models/recipeModel");
const UserFavorite = require("../models/userFavoritesModel");

//check the fieldname and route the uploaded file appropriately
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "image") {
			cb(null, "public/images/");
		} else if (file.fieldname === "recipePDF") {
			cb(null, "public/pdfs/");
		}
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

//include a conditional that also checks for a .pdf extension when the fieldname is recipePDF
const imageFilter = (req, file, cb) => {
	try {
		if (!file) {
			return cb(new Error("No File provided."), false);
		}
		if (
			file.fieldname === "image" &&
			file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)
		) {
			cb(null, true);
		} else if (
			file.fieldname === "recipePDF" &&
			file.originalname.match(/\.(pdf)$/i)
		) {
			cb(null, true);
		} else if (file.fieldname === "image") {
			cb(
				new Error(
					"Only image files (jpg, jpeg, webp, png, or gif) are allowed.",
				),
				false,
			);
		} else if (file.fieldname === "recipePDF") {
			cb(
				new Error("Only PDF files are allowed for uploading a recipe."),
				false,
			);
		} else {
			cb(new Error(`Unexpected file field: ${file.fieldname}`), false);
		}
	} catch (error) {
		cb(new Error(`File validation error: ${error.message}`), false);
	}
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class RecipeService {
	// method to find all of the documents in the database - OK if nothing is found as DB would be empty
	static list() {
		return Recipe.find({})
			.then((recipes) => {
				return recipes;
			})
			.catch((error) => {
				console.error(`Error retrieving list of recipes via List: ${error}`);
				throw new Error(
					`Failed to retrieve current recipes in database: ${error.message}`,
				);
			});
	}

	// method to find an individual document by its id in the database
	static find(id) {
		// unclear yet how this might get used within an application so adding some error handling in the event that there is no id; in this case, reject the Promise for the api-route to handle
		if (!id) {
			return Promise.reject(new Error("Recipe ID is required"));
		}
		return Recipe.findById(id)
			.then((recipe) => {
				//if Promise resolves but no data found, throw error rather than resolve to null
				if (!recipe) {
					throw new Error(`Recipe with id ${id} not found`);
				}

				return recipe;
			})
			.catch((error) => {
				console.error(`Error locating recipe with id ${id} via Find`);
				throw new Error(`Invalid recipe ID: ${error.message}`);
			});
	}

	//method to find recipes with query filter where favorite is set to true
	// static favorite() {
	// 	return Recipe.find({favorite: true})
	// 		.then((recipes) => {
	// 			if(!recipes) {
	// 				throw new Error('No favorites found');
	// 			}
	// 			return recipes
	// 		})
	// 		.catch((error) => {
	// 			console.error('Error locating any recipes with favorite flag set to true');
	// 			throw new Error(`Favorite recipe error: ${error.message}`);
	// 		});
	// }

	// Updated method to get favorites for a specific user
	static async getUserFavorites(userId) {
		if (!userId) {
			throw new Error("User ID is required");
		}
		
		try {
			const favorites = await UserFavorite.find({ userId })
				.populate('recipeId')
				.sort({ createdAt: -1 });
			
			return favorites.map(fav => fav.recipeId);
		} catch (error) {
			console.error(`Error getting favorites for user ${userId}:`, error);
			throw new Error(`Failed to retrieve user favorites: ${error.message}`);
		}
	}

	// Method to add a recipe to user's favorites
	static async addToFavorites(userId, recipeId) {
		if (!userId || !recipeId) {
			throw new Error("User ID and Recipe ID are required");
		}

		try {
			// Check if recipe exists
			const recipe = await Recipe.findById(recipeId);
			if (!recipe) {
				throw new Error(`Recipe with id ${recipeId} not found`);
			}

			// Add to favorites (will fail if already exists due to unique index)
			const favorite = new UserFavorite({ userId, recipeId });
			await favorite.save();
			
			return favorite;
		} catch (error) {
			if (error.code === 11000) {
				throw new Error("Recipe is already in favorites");
			}
			console.error(`Error adding recipe ${recipeId} to favorites for user ${userId}:`, error);
			throw new Error(`Failed to add to favorites: ${error.message}`);
		}
	}

	// Method to remove a recipe from user's favorites
	static async removeFromFavorites(userId, recipeId) {
		if (!userId || !recipeId) {
			throw new Error("User ID and Recipe ID are required");
		}

		try {
			const result = await UserFavorite.deleteOne({ userId, recipeId });
			
			if (result.deletedCount === 0) {
				throw new Error("Recipe not found in favorites");
			}
			
			return result;
		} catch (error) {
			console.error(`Error removing recipe ${recipeId} from favorites for user ${userId}:`, error);
			throw new Error(`Failed to remove from favorites: ${error.message}`);
		}
	}

	// Method to check if a recipe is favorited by a user
	static async isFavorited(userId, recipeId) {
		if (!userId || !recipeId) {
			return false;
		}

		try {
			const favorite = await UserFavorite.findOne({ userId, recipeId });
			return !!favorite;
		} catch (error) {
			console.error(`Error checking if recipe ${recipeId} is favorited by user ${userId}:`, error);
			return false;
		}
	}

	// Method to get recipes with their favorite status for a user
	static async listWithFavoriteStatus(userId) {
		try {
			const recipes = await Recipe.find({});
			
			if (!userId) {
				return recipes.map(recipe => ({
					...recipe.toObject(),
					isFavorited: false
				}));
			}

			const userFavorites = await UserFavorite.find({ userId }).select('recipeId');
			const favoriteIds = new Set(userFavorites.map(fav => fav.recipeId.toString()));

			return recipes.map(recipe => ({
				...recipe.toObject(),
				isFavorited: favoriteIds.has(recipe._id.toString())
			}));
		} catch (error) {
			console.error(`Error getting recipes with favorite status for user ${userId}:`, error);
			throw new Error(`Failed to retrieve recipes: ${error.message}`);
		}
	}

	// method to create a new document in the database
	static create(obj) {
		const recipe = new Recipe(obj);
		return recipe.save().catch((error) => {
			console.error("Error creating new recipe object within the recipeController", error);
			throw new Error(`Failed to create a new recipe: ${error.message}`);
		});
	}

	//method to update a document in the database
	static update(id, data) {
		//similar to find, unclear how this might get used so want to make sure that the id exists
		if (!id) {
			return Promise.reject(new Error("Recipe ID is required"));
		}
		return Recipe.findById(id)
			.then((recipe) => {
				//if Promise resolves but no data found, throw error rather than resolve to null
				if (!recipe) {
					throw new Error(`Recipe with id ${id} not found`);
				}

				recipe.set(data);
				recipe.save();
				return recipe;
			})
			.catch((error) => {
				//per the Mongoose documentation on error handling: 'An instance of this error class will be returned when mongoose failed to cast a value'
				if (error.name === "CastError") {
					throw new Error(`Invalid format for recipe id: ${id}`);
				}
				console.error(`Error updating recipe via Update with id ${id}`, error);
				throw error;
			});
	}

	//method to delete a document from the database
	static delete(id) {
		if (!id) {
			return Promise.reject(new Error("Recipe ID is required"));
		}
		return Recipe.deleteOne({ _id: id })
			.then((result) => {
				if (result.deletedCount === 0) {
					throw new Error(`Issue finding or deleting recipe with id ${id}`);
				}

				return result;
			})
			.catch((error) => {
				if (error.name === "CastError") {
					throw new Error(`Invalid format for recipe id: ${id}`);
				}
				console.error(`Error deleting recipe with id ${id}`);
				throw error;
			});
	}
}

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.RecipeService = RecipeService;
