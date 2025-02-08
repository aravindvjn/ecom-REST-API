import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { handleCors } from "./utils/cors.js";

dotenv.config();

const app = express();

const PORT = 3000;

connectDB();

app.use(handleCors)

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(routes.homeRoute);

app.use("/auth", routes.authRoute);

app.use("/products", routes.productRoute);

app.use("/cart", routes.cartRoute);

app.use("/order", routes.orderRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
