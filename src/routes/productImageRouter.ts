import express from "express";
import multer from "multer";
import ProductImageController from "../controller/Product-Image/ProductImage.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();
const upload = multer();

const productImageController = new ProductImageController();

router.post(
  "/api/create/image/:id", upload.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
    productImageController.createImage(req, res);
  })

router.get("/api/find/image/:id", authMiddleware, (req, res) => {
  productImageController.getImage(req, res)
});

router.get("/api/img/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.getDataImage(req, res)
});

router.put("/api/update/image/:id", upload.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.updateImage(req, res)
});

router.delete("/api/remove/image/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.deleteImage(req, res)
});

export default router;