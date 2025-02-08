import { Request, Response } from 'express'
import Product from "../model/products.js";
import User from "../model/users.js";

//Get the cart
export const getOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user!.id;

    const user = await User.findById(userId).populate({
      path: "orders._id",
      model: "products",
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, orders: user.orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


//order the product
export const placeOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    let { products } = req.body; //products = [ {productId,quantity} ];

    products = JSON.parse(products);

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No products selected" });
    }
    products = products.map((product) => ({
      ...product,
      quantity: parseInt(product.quantity, 10) || 1,
    }));

    const availableProducts = await Product.find({
      _id: { $in: products.map((p:any) => p.productId) },
    });

    if (availableProducts.length !== products.length) {
      return res
        .status(400)
        .json({ success: false, error: "Some products are not available" });
    }

    products = availableProducts.map((product) => {
      return {
        _id: product._id,
        price: product.price,
        quantity:
          products.find(
            (p:any) => p.productId.toString() === product._id.toString()
          )?.quantity || 1,
      };
    });

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      {
        $push: {
          orders: {
            $each: products.map((product:any) => ({
              _id: product._id,
              quantity: product.quantity,
              totalPrice: product.price * product.quantity,
            })),
          },
        },
      },
      { new: true }
    );


    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({
      success: true,
      message: "Order placed successfully. ",
    });
  } catch (error) {
    console.error("Error in order placing:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

