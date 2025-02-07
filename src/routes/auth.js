import express from "express";
import {
  getPasswordResetMail,
  resetPassword,
  signin,
  signup,
  verifyEmail,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verify/:token", verifyEmail);

router.post("/signin", signin);

router.post("/reset-password", getPasswordResetMail);

router.post("/reset-password/:token", resetPassword);

export default router;
