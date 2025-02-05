import Product from "../model/products.js";

//Get All Products
export const getProducts = async (req, res, next) => {
  try {

    const products = await Product.find();

    res.status(200).json({ products: products ?? [] });

  } catch (error) {

    console.error("Error in getting Products : ", error);

  }
};


//Get Products by Id
export const getProductById = async (req, res, next) => {

  try {

    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
    });

    res.status(200).json({ product: product ?? {} });

  } catch (error) {
    
    console.error("Error in getting Product by ID : ", error);
  }
};

//create a new Product
export const createProduct = async (req, res, next) => {

  try {
    const { title, description, price } = req.body;

    const product = new Product({ title, description, price });

    await product.save();

    res.status(201).json({ product: product });

  } catch (error) {

    console.error("Error in creating Product : ", error);

  }
};
