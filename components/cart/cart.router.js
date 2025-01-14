import express from "express";
const router = express.Router();
import cartController from "./cart.controller.js";
import { ensureHasCart } from "../../shared/middlewares/cart.middleware.js";

router.get("/", ensureHasCart, cartController.getCartPage);
router.post("/add/:id", ensureHasCart, cartController.addToCart);
router.post("/update/:id", ensureHasCart, cartController.updateCartItem);
router.post("/remove/:id", ensureHasCart, cartController.removeFromCart);
router.get('/checkout/seats', ensureHasCart, cartController.getCheckoutWithSeats);

export default router;
