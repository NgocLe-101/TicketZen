import express from "express";
import productController from "./product.controller.js";
import detailRouter from "./detail/detail.router.js";
const router = express.Router();

router.get("/", productController.getProductPage);
router.get("/api", productController.getProducts);
router.use(detailRouter);

export default router;
