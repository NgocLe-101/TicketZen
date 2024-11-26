const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.get("/auth", (req, res) => {
  res.redirect("/auth/login");
});

// Routes for login
router.get("/auth/login", authController.getLoginPage);
router.post("/auth/login", authController.postLogin);

// Routes for register
router.get("/auth/register", authController.getRegisterPage);
router.post("/auth/register", authController.postRegister);

// Verify email
router.get("/auth/verify-email", authController.verifyEmail);
router.post("/auth/resend-email", authController.resendEmail);

router.get("/auth/logout", authController.logout);

module.exports = router;
