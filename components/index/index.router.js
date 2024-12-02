import express from "express";
const router = express.Router();
import indexController from "./index.controller";

router.get("/", indexController.getIndexPage);

export default router;
