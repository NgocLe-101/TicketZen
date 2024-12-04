import express from "express";
const router = express.Router();
import indexController from "./index.controller.js";

router.get("/", indexController.getIndexPage);

export default router;
