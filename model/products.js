import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  price: { type: Number },
});

const Product = mongoose.model("products", productsSchema);

export default Product;
