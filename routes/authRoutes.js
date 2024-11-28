const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.get(
  "/profile",
  authController.ensureAuthenticated, // Check if user is authenticated
  authController.getProfilePage
);

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

// Routes for forgot password
router.get("/auth/forgot-password", authController.getForgotPasswordPage);
router.post("/auth/forgot-password", authController.postForgotPassword);

// Routes for reset password
router.get("/auth/reset-password", authController.getResetPasswordPage);
router.post("/auth/reset-password", authController.postResetPassword);

router.post("/auth/logout", authController.logout);

module.exports = router;
