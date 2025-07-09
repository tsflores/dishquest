const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

//create a new schema for our app
const userSchema = new Schema({
	username: {type: String, required: true, unique: true, minlength: 8},
	name: { type: String, required: true },
	password: { type: String, required: true, minlength: 8}
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
