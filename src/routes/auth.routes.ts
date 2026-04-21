import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refreshSession", (req, res) => authController.refreshSession(req, res));

export default router;
