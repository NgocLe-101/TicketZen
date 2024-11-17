// const User = require("../models/user.model"); // Import model
// const bcrypt = require("bcrypt"); // Import bcrypt

// Controller register
exports.getRegisterPage = (req, res) => {
  res.render("register"); // Render register page
};

// exports.postRegister = async (req, res) => {
//   passport.authenticate("local-register", {
//     successRedirect: "/",
//     failureRedirect: "/register",
//     failureFlash: true,
//   })(req, res, next);
// };

// Controller login
exports.getLoginPage = (req, res) => {
  res.render("login", { errorMessage: req.flash("error") }); // Render login page
};

// exports.postLogin = async (req, res) => {
//   passport.authenticate("local-login", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, next);
// };

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
