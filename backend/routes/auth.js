import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fetch from "node-fetch";

const router = express.Router();

/* -----------------------------
   REGISTER — création de compte
   ----------------------------- */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ success: false, message: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);

  // Générer code 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await User.create({
    email,
    password: hash,
    emailVerified: false,
    verificationCode: code,
    verificationExpires: Date.now() + 10 * 60 * 1000
  });

  // Envoi email via Brevo
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { email: process.env.MAIL_FROM },
      to: [{ email }],
      subject: "Votre code de vérification",
      htmlContent: `<p>Votre code est : <strong>${code}</strong></p>`
    })
  });

  res.json({ success: true, needVerification: true });
});

/* -----------------------------
   VERIFY EMAIL — code 6 chiffres
   ----------------------------- */
router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  if (user.verificationCode !== code)
    return res.json({ success: false, message: "Code incorrect" });

  if (user.verificationExpires < Date.now())
    return res.json({ success: false, message: "Code expiré" });

  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationExpires = null;
  await user.save();

  res.json({ success: true });
});

/* -----------------------------
   LOGIN — connexion
   ----------------------------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  if (!user.emailVerified)
    return res.json({ success: false, needVerification: true });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ success: false });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ success: true, token });
});

export default router;
