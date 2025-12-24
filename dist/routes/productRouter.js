import express from "express";
import ProductController from "../controller/Product/Product.controller.js";
import { requireRole } from "../middleware/role.js";
import { authMiddleware } from "../middleware/auth.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const productController = new ProductController();
router.post("/api/product/create", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.createProduct(req, res);
});
router.post("/api/product/upload", authMiddleware, upload.single("arquivo"), requireRole("ADMIN"), async (req, res) => {
    productController.uploadExcel(req, res);
});
router.get("/api/product/find/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.findById(req, res);
});
router.get("/api/product/find", authMiddleware, (req, res) => {
    productController.findUniqueProduct(req, res);
});
router.get("/api/product/autocomplete", authMiddleware, (req, res) => {
    productController.autocompleteProduct(req, res);
});
router.get("/api/product/allProducts", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.findProduct(req, res);
});
router.put("/api/product/update/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.updateProduct(req, res);
});
router.get("/api/product/export", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.exportExcel(req, res);
});
router.delete("/api/product/remove/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
    productController.deleteProduct(req, res);
});
export default router;
