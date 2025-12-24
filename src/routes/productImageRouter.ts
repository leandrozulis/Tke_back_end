import express from "express";
import multer from "multer";
import ProductImageController from "../controller/Product-Image/ProductImage.controller";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = express.Router();
const upload = multer();

const productImageController = new ProductImageController();

router.post(
  "/create/image/:id", upload.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
    productImageController.createImage(req, res);
  })

router.get("/find/image/:id", authMiddleware, (req, res) => {
  productImageController.getImage(req, res)
});

router.get("/img/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.getDataImage(req, res)
});

router.put("/update/image/:id", upload.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.updateImage(req, res)
});

router.delete("/remove/image/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.deleteImage(req, res)
});

export default router;