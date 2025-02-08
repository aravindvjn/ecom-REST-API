import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

export type VerifiedJWTType = {
  id: string;
  email: string;
};

// Extend Express Request type to include `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: VerifiedJWTType | JwtPayload;
  }
}

export const adminVerification = (req: Request, res: Response, next: NextFunction):any => {
  const authHeader = req.header("Authorization");
  const secret = process.env.SECRET;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  if (!secret) {
    console.error("JWT SECRET is not defined in environment variables.");
    return res.status(500).json({ success: false, message: "Internal server error" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, secret);

    if (typeof verified === "string" || !("email" in verified)) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    req.user = verified;

    if (typeof verified !== "string" && verified.email === adminEmail) {
      return next();
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }
};
