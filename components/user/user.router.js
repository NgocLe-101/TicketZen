import express from "express";
const router = express.Router();

import userController from "./user.controller";
import { ensureAuthenticated } from "../../shared/middlewares/auth.middleware";

router.get("/", ensureAuthenticated, userController.getProfilePage);

export default router;
