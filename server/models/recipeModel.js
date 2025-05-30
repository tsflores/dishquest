const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//create a new schema for our app
const schema = new Schema({
	name: { type: String, required: true },
	chef: { type: String, required: true },
	description: { type: String, required: true },
	meal: { type: String, required: true },
	preptime: { type: String, required: true },
	cooktime: { type: String, required: true },
	image: { type: String, required: true },
	recipePDF: { type: String, required: true },
	favorite: {type: Boolean, required: false},
	createdAt: { type: Date },
	updatedAt: { type: Date },
});

//add or update the date as a document in the collections
schema.pre("save", function (next) {
	
	if (!this.createdAt) {
		this.createdAt = new Date();
		this.favorite = false;
	} else {
		this.updatedAt = new Date();
	}
	next();
});

module.exports = mongoose.model("Recipe", schema);
