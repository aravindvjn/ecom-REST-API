import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
} from "../controllers/products.js";
import { adminVerification } from "../middlewares/admin.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

// Middleware to check that the req is from the admin
router.use(adminVerification)

router.post("/", createProduct);

router.put("/:id", editProduct);

router.delete("/:id", deleteProduct);

export default router;
