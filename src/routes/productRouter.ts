import express from "express";
import ProductController from "../controller/Product/Product.controller";
import { requireRole } from "../middleware/role";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const productController = new ProductController();

router.post("/product/create", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.createProduct(req, res);
})

router.post("/product/upload", authMiddleware, upload.single("arquivo"), requireRole("ADMIN"), async (req, res) => {
  productController.uploadExcel(req, res);
})

router.get("/product/find/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.findById(req, res);
})

router.get("/product/find", authMiddleware, (req, res) => {
  productController.findUniqueProduct(req, res);
})

router.get("/product/autocomplete", authMiddleware, (req, res) => {
  productController.autocompleteProduct(req, res);
})

router.get("/product/allProducts", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.findProduct(req, res);
})

router.put("/product/update/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.updateProduct(req, res);
})

router.get("/product/export", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.exportExcel(req, res);
})


router.delete("/product/remove/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.deleteProduct(req, res);
})

export default router;