import mongoose from "mongoose";

const pendingUser = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
});

const VerificationPendingUser = mongoose.model("pendingUser", pendingUser);

export default VerificationPendingUser;
