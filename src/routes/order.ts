import express from "express";
import { isUserAuthenticated } from "../middlewares/user-authentication.js";
import { getOrders, placeOrders } from "../controllers/order.js";

const router = express.Router();

// PATH : /order/*

router.use(isUserAuthenticated);

router.get("/", getOrders);

router.post("/", placeOrders);

export default router;
