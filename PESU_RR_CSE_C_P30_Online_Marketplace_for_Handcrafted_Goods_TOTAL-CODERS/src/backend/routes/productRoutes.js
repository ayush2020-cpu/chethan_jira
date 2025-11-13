import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// ===============================================
// PRODUCT ROUTES (EPIC 3 – Browsing + Filter + Sort + Caching)
// ===============================================

// Get all products (with filters, sort, pagination, caching)
router.get("/", listProducts);

// Get a single product by ID
router.get("/:id", getProduct);

// Add a new product
router.post("/", createProduct);  // protect with admin in production

// Update an existing product
router.put("/:id", updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

export default router;
