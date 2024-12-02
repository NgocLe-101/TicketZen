import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../../shared/middlewares/auth.middleware";
import cartController from "./cart.controller";

router.get("/", ensureAuthenticated, cartController.getCartPage);
router.post("/add/:id", ensureAuthenticated, cartController.addToCart);
router.post("/update/:id", ensureAuthenticated, cartController.updateCartItem);
router.post("/remove/:id", ensureAuthenticated, cartController.removeFromCart);

export default router;
