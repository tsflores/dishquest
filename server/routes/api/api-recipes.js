const express = require("express");
const router = express.Router();
const multer = require("multer");
const recipeController = require("../../controllers/recipeController");
const RecipeService = recipeController.RecipeService;

//from the multer documentation on using .fields for multiple files
const upload = multer({
	storage: recipeController.storage,
	fileFilter: recipeController.imageFilter,
}).fields([
	{ name: "image", maxCount: 1 },
	{ name: "recipePDF", maxCount: 1 },
]);

router.use((req, res, next) => {
	res.set({
		// allow any domain, allow REST methods that have been implemented
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
		"Access-Control-Allow-Headers":
			"Content-Type, Access-Control-Allow-Headers",
		"Content-type": "application/json",
	});
	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}
	next();
});

// create a new document in the database
router.post("/", upload, async (req, res, next) => {
	const imagepath = req.files.image
		? `/static/images/${req.files.image[0].filename}`
		: null;
	const pdfpath = req.files.recipePDF
		? `/static/pdfs/${req.files.recipePDF[0].filename}`
		: null;

	const recipeData = {
		name: req.body.name,
		chef: req.body.chef,
		description: req.body.description,
		meal: req.body.meal,
		preptime: req.body.preptime,
		cooktime: req.body.cooktime,
		image: imagepath,
		recipePDF: pdfpath,
	};

	try {
		const recipeCreate = await RecipeService.create(recipeData);
		res.status(201);
		res.send(JSON.stringify(recipeCreate));
	} catch (error) {
		console.log("Error on the POST within api-recipes", error);
		res.status(500).send(JSON.stringify({ error: error.message }));
	}
});

// return all of the documents in the database
router.get("/", (req, res, next) => {
	RecipeService.list()
		.then((recipes) => {
			res.status(200).json(recipes);
		})
		.catch((error) => {
			console.error("Error retrieving recipes:", error);
			res.status(500).json({ error: error.message || "Failed to retrieve recipes" });
		});
});

//return any recipes in the collection that have favorite set to true
// router.get("/favorites", (req,res,next) => {
// 	RecipeService.favorite()
// 	.then((recipes) => {
// 		res.status(200).json(recipes);
// 	})
// 	.catch((error) => {
// 		console.error("Error retrieving favorite recipes:", error);
// 		res.status(500).json({error: error.message || "Failed to retrieve favorite recipes"});
// 	});
// });

// Get user's favorite recipes
router.get("/favorites/:userId", async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const favorites = await RecipeService.getUserFavorites(userId);
		res.status(200).json(favorites);
	} catch (error) {
		console.error("Error retrieving user's favorite recipes:", error);
		res.status(500).json({ error: error.message || "Failed to retrieve favorite recipes" });
	}
});

// Add recipe to user's favorites
router.post("/favorites/:userId/:recipeId", async (req, res, next) => {
	try {
		const { userId, recipeId } = req.params;
		const favorite = await RecipeService.addToFavorites(userId, recipeId);
		res.status(201).json(favorite);
	} catch (error) {
		console.error("Error adding recipe to favorites:", error);
		res.status(400).json({ error: error.message });
	}
});

// Remove recipe from user's favorites
router.delete("/favorites/:userId/:recipeId", async (req, res, next) => {
	try {
		const { userId, recipeId } = req.params;
		await RecipeService.removeFromFavorites(userId, recipeId);
		res.status(204).send();
	} catch (error) {
		console.error("Error removing recipe from favorites:", error);
		res.status(400).json({ error: error.message });
	}
});

// Check if recipe is favorited by user
router.get("/favorites/:userId/:recipeId/status", async (req, res, next) => {
	try {
		const { userId, recipeId } = req.params;
		const isFavorited = await RecipeService.isFavorited(userId, recipeId);
		res.status(200).json({ isFavorited });
	} catch (error) {
		console.error("Error checking favorite status:", error);
		res.status(500).json({ error: error.message });
	}
});

// find a specific document by id in the database
router.get("/:recipeid", (req, res, next) => {
	RecipeService.find(req.params.recipeid)
		.then((recipe) => {
			res.status(200).json(recipe);
		})
		.catch((err) => {
			res.status(404);
			res.send(err);
		});
});

// update properties within a specific document by id in the database
router.put("/:recipeid", (req, res, next) => {
	const put_data = req.body;
	RecipeService.update(req.params.recipeid, put_data)
		.then((updatedRecipe) => {
			res.status(200);
			res.set({ "Content-type": "application/json" });
			res.send(JSON.stringify(updatedRecipe));
		})
		.catch((err) => {
			res.status(404);
			res.send(err);
		});
});

// delete a document from the database by id
router.delete("/:recipeid", (req, res, next) => {
	RecipeService.delete(req.params.recipeid)
		.then((deletedRecipe) => {
			res.status(200);
			res.send(JSON.stringify(deletedRecipe));
		})
		.catch((err) => {
			res.status(404);
			res.send(err);
		});
});

// error
router.use((err, req, res, next) => {
	console.error(err);
	res.status(500);
	res.end();
});

module.exports = router;
