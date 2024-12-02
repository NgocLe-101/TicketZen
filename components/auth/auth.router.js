import express from "express";
import passport from "passport";

const router = express.Router();
import authController from "./auth.controller";

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Routes for login
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);

// Routes for register
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.postRegister);

// Routes for forgot password
router.get("/forgot-password", authController.getForgotPasswordPage);
router.post("/forgot-password", authController.postForgotPassword);

// Routes for reset password
router.get("/reset-password", authController.getResetPasswordPage);
router.post("/reset-password", authController.postResetPassword);

// Route for verify email
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-email", authController.resendEmail);

// Route for Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Route for Facebook login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Route for Facebook callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Route for logout
router.post("/logout", authController.logout);

export default router;
