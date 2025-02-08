import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const isUserAuthenticated = (req: Request, res: Response, next: NextFunction): any => {

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.SECRET!);
    if (typeof verified === "string") {
      return res.status(200).json({ success: false, message: "Invalid token" })
    }
    req.user = verified;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    next();

  } catch (err) {

    console.error("JWT Verification Error:", err);
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
