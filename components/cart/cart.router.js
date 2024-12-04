import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../../shared/middlewares/auth.middleware.js";
import cartController from "./cart.controller.js";

router.get("/", ensureAuthenticated, cartController.getCartPage);
router.post("/add/:id", ensureAuthenticated, cartController.addToCart);
router.post("/update/:id", ensureAuthenticated, cartController.updateCartItem);
router.post("/remove/:id", ensureAuthenticated, cartController.removeFromCart);

export default router;
