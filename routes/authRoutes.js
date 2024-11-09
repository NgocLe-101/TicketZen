const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Routes for login
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);

// Routes for register
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.postRegister);

module.exports = router;
