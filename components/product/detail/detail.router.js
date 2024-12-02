import express from "express";
const router = express.Router();
import detailController from "./detail.controller";

router.get("/:id", detailController.getDetailPage);

export default router;
