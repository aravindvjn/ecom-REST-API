import express from "express";
import homeRouter from "./src/routes/home.js";
import productsRouter from "./src/routes/products.js";
import connectDB from "./src/utils/db.js";
import authRouter from './src/routes/auth.js'

const app = express();

const PORT = 3000;

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(homeRouter);

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
