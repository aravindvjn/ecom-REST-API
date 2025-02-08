import { hashPassword, verifyPassword } from "../helpers/hashPassword.js";
import { sendPasswordResetMail } from "../helpers/reset-password-mail.js";
import { sendEmailVerification } from "../helpers/send-email-verification.js";
import VerificationPendingUser from "../model/pending-users.js";
import User from "../model/users.js";
import { validateUser } from "../validation/user-validation.js";
import crypto from "crypto";
import { validatePassword } from "../validation/validate-password.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

//verify email
export const verifyEmail = async (req:Request, res:Response): Promise<any>  => {
  try {
    const { token } = req.params;

    const pendingVerification = await VerificationPendingUser.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!pendingVerification) {
      return res
        .status(404)
        .json({ success: false, error: "Verification link expired" });
    }
    const alreadyVerified = await User.findOne({
      email: pendingVerification.email,
    });

    if (alreadyVerified) {
      return res
        .status(400)
        .json({ success: false, error: "Email already verified" });
    }

    const user = new User({
      name: pendingVerification.name,
      email: pendingVerification.email,
      password: pendingVerification.password,
    });

    user.save();

    await VerificationPendingUser.findByIdAndDelete(pendingVerification._id);

    //Send verification email here
    await res
      .status(200)
      .json({ success: true, message: "User signed up successfully" });
  } catch (error) {
    console.error("Error in sigining up User : ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//Signup
export const signup = async (req:Request, res:Response) : Promise<any>  => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const valid = validateUser(req.body);

    if (!valid.success) {
      return res.status(400).json({ success: false, error: valid.errors });
    }

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      throw new Error();
    }

    const token = await crypto.randomBytes(32);
    const verificationToken = token.toString("hex");

    const existingPendingUser = await VerificationPendingUser.findOne({
      email,
    });

    if (existingPendingUser) {
      await existingPendingUser.updateOne({
        verificationToken,
        verificationTokenExpires: Date.now() + 3600000,
      });
    } else {
      const pendingUser = new VerificationPendingUser({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires: Date.now() + 3600000,
      });

      await pendingUser.save();
    }

    //Send verification email here
    await sendEmailVerification(email, verificationToken);

    res
      .status(200)
      .json({ success: true, message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error in sigining up User : ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//Signin
export const signin = async (req:Request, res:Response) : Promise<any>  => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Incorrect Email." });
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password." });
    }

    //setting token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET!,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      success: true,
      message: "User signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });

  } catch (error) {
    console.error("Error in signing in User : ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//get reset password mail
export const getPasswordResetMail = async (req:Request, res:Response) : Promise<any>  => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "Email not found" });
    }

    const token = await crypto.randomBytes(32);
    const verificationToken = token.toString("hex");

    await User.findByIdAndUpdate(user._id, {
      token: verificationToken,
      tokenExpiration: Date.now() + 3600000,
    });

    await sendPasswordResetMail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
    
  } catch (error) {
    console.error("Error in sending password reset mail : ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//reset password
export const resetPassword = async (req:Request, res:Response) : Promise<any>  => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: "Password must be between 8 to 20 characters long",
      });
    }

    const user = await User.findOneAndUpdate(
      { token, tokenExpiration: { $gt: Date.now() } },
      {
        password: await hashPassword(password),
        token: null,
        tokenExpiration: null,
      },
      { new: true }
    );

    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Token not found or expired" });
    }
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetting password : ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
