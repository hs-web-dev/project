import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null },
  verificationExpires: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
