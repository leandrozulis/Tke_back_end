import express from "express";
import { UserController } from "../controller/Users/users.controller.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

const userController = new UserController();

router.post("/api/login", (req, res) => {
  userController.login(req, res);
});

router.get("/api/me", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});

export default router;