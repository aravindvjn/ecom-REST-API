import express from "express";
import connectDB from "./src/utils/db.js";
import session from "express-session";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();

const PORT = 3000;

connectDB();
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.session.user = {
    id: "67a5ee6217b2c4070eef52a2",
    username: "johndoe",
    role: "admin",
  };
  next();
});

app.use(routes.homeRoute);

app.use("/auth", routes.authRoute);

app.use("/products", routes.productRoute);

app.use("/cart", routes.cartRoute);

app.use("/order", routes.orderRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
