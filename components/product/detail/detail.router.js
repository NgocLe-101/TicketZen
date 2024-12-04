import express from "express";
const router = express.Router();
import detailController from "./detail.controller.js";

router.get("/:id", detailController.getDetailPage);

export default router;
