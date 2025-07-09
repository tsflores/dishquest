const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/userController");

// CORS middleware
router.use((req, res, next) => {
	res.set({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization",
		"Content-type": "application/json",
	});
	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}
	next();
});

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
