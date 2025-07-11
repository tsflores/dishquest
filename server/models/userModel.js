const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

//create a new schema for a user
const userSchema = new Schema({
  username: { type: String, required: [true, 'A username is required'], unique: [true, 'Username in use.  Please select another'], minlength: 8, maxlength: 20 },
  email: { type: String, required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
  name: { type: String, required: true, minlength: 2 },
  password: { type: String, required: true, minlength: 8 },
  createdAt: { type: Date }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);

  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
