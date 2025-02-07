import Product from "../model/products.js";
import User from "../model/users.js";

//Get the cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "cart._id",
      model:'products'
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//Delete a product from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { _id: productId } },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, message: "Product removed from the cart" });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//add or Update the cart
export const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let { quantity } = req.body;

    quantity = parseInt(quantity, 10) || 1;

    if (isNaN(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const userId = req.user.id;

    const results = await User.findOne(
      { _id: userId, "cart._id": productId },
      { "cart.$": 1 }
    );

    const cart = results?.cart[0] || null;

    if (cart) {
      if (cart.quantity === quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Product already in cart" });
      } else {
        await User.findByIdAndUpdate(
          userId,
          {
            $set: { "cart.$[item].quantity": quantity },
          },
          {
            arrayFilters: [{ "item._id": productId }],
            new: true,
          }
        );

        return res
          .status(201)
          .json({ success: true, message: "Product updated successfully" });
      }
    }

    await User.findByIdAndUpdate(userId, {
      $push: {
        cart: {
          _id: productId,
          quantity,
        },
      },
    });

    res.json({
      success: true,
      message: "Product successfully added to the cart. ",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
