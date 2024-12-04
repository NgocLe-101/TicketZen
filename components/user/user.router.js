import express from "express";
const router = express.Router();

import userController from "./user.controller.js";
import { ensureAuthenticated } from "../../shared/middlewares/auth.middleware.js";

router.get("/", ensureAuthenticated, userController.getProfilePage);

export default router;
