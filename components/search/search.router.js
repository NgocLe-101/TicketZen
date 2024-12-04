import express from "express";

const router = express.Router();
import searchController from "./search.controller.js";

router.get("/", searchController.renderMovies);
router.get("/result", searchController.getMovies);

export default router;
