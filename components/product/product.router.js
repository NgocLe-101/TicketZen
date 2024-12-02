import express from "express";
import productController from "./product.controller";
import detailRouter from "./detail/detail.router";
const router = express.Router();

router.get("/", productController.getProductPage);
router.use(detailRouter);

export default router;
