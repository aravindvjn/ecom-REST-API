import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

export default router;
