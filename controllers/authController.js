const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model"); // Import model
const router = express.Router();

// Controller register
exports.getRegisterPage = (req, res) => {
  res.render("register"); // Render register page
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.render("register", { errorMessage: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("register", { errorMessage: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

// Controller login
exports.getLoginPage = (req, res) => {
  res.render("login"); // Render login page
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { errorMessage: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { errorMessage: "Invalid email or password" });
    }

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};
