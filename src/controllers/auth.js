import { hashPassword, verifyPassword } from "../helpers/hashPassword.js";
import { sendEmailVerification } from "../helpers/send-email-verification.js";
import VerificationPendingUser from "../model/pending-users.js";
import User from "../model/users.js";
import { validateUser } from "../validation/user-validation.js";
import crypto from "crypto";

//verify email
export const verifyEmail = async (req, res) => {
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
export const signup = async (req, res) => {
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
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Incorrect Email." });
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password." });
    }

    //setting the session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ 
      success: true,
      message: "User signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error in signing in User : ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
