import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  createSampleProducts
} from "../controllers/productController.js";

const router = express.Router();

/*
  ALL PRODUCT ROUTES
  -------------------
  GET    /api/products             → list all products (with pagination/search support)
  GET    /api/products/:id         → get single product
  POST   /api/products             → add new product (admin or testing)
  POST   /api/products/create-samples → seed sample products (testing only)
*/

// Get all products (supports pagination/search)
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getProduct);

// Add new product manually
router.post("/", createProduct);

// Create sample products (for testing only)
router.post("/create-samples", createSampleProducts);

export default router;

