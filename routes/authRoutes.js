const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

// Routes for login
router.get("/login", authController.getLoginPage);
router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/?login=success",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Routes for register
router.get("/register", authController.getRegisterPage);
router.post(
  "/register",
  passport.authenticate("local-register", {
    successRedirect: "/login",
    failureRedirect: "/register",
    failureFlash: true,
  })
);

module.exports = router;
