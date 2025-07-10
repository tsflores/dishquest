const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET = process.env.JWT_SECRET; 

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, name, password } = req.body;
      const user = new User({ username, email, name, password });
      await user.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
        expiresIn: "1d",
      });

      res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
