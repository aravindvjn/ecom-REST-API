import express from "express";
import { getCart, removeFromCart, updateCart } from "../controllers/cart.js";
import { isUserAuthenticated } from "../middlewares/user-authentication.js";

const router = express.Router();

router.use(isUserAuthenticated);

router.get("/",getCart)

router.delete("/:productId", removeFromCart);

//adding and updating carts
router.post("/:productId", updateCart);


export default router;
