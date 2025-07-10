const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

//create a new schema for a user
const userSchema = new Schema({
	username: {type: String, required: true, unique: true, minlength: 8},
  email: {type: String, required: true, unique: true},
	name: { type: String, required: true, minlength: 2 },
	password: { type: String, required: true, minlength: 8}
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
