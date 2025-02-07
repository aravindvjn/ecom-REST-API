import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const isUserAuthenticated = (req, res, next) => {

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();

  } catch (err) {
    
    console.error("JWT Verification Error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
