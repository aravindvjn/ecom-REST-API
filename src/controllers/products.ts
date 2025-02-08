import { Request, Response } from "express";
import Product from "../model/products.js";

//Get All Products
export const getProducts = async (req:Request, res:Response) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ products: products ?? [] });
  } catch (error) {
    console.error("Error in getting Products : ", error);
    res.status(500).json({ message: "Server is not responding" });
  }
};

//Get Products by Id
export const getProductById = async (req:Request, res:Response): Promise<any> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: product ?? {} });
  } catch (error) {
    console.error("Error in getting Product by ID : ", error);
    res.status(500).json({ message: "Server is not responding" });
  }
};

//create a new Product
export const createProduct = async (req:Request, res:Response): Promise<any> => {
  try {
    const { title, description, price } = req.body;

    const product = new Product({ title, description, price });

    await product.save();

    res.status(201).json({ product: product });
  } catch (error) {
    console.error("Error in creating Product : ", error);

    res.status(500).json({ message: "Server is not responding" });
  }
};

//Edit a Product
export const editProduct = async (req:Request, res:Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error("Error in editing Product : ", error);
    res.status(500).json({ message: "Server is not responding" });
  }
};

//Delete a Product
export const deleteProduct = async (req:Request, res:Response): Promise<any> => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleting Product : ", error);
    res.status(500).json({ message: "Server is not responding" });
  }
};
