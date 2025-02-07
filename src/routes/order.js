import express from "express";
import { isUserAuthenticated } from "../middlewares/user.js";
import { getOrders, placeOrders } from "../controllers/order.js";

const router = express.Router();

router.use(isUserAuthenticated);

router.get("/", getOrders);

router.post("/", placeOrders);

export default router;
