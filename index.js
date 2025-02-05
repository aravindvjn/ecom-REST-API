import express from "express";
import homeRouter from "./routes/home.js";
import productsRouter from "./routes/products.js";
import connectDB from "./utils/db.js";

const app = express();

const PORT = 3000;

connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(homeRouter);

app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
