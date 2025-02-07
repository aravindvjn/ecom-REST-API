import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const adminVerification = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;

    if (verified.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      res.status(401).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
