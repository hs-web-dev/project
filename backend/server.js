import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ============================
   CORS — VERSION 100% COMPLÈTE
   ============================ */
app.use(cors({
  origin: [
    "https://hs-web-dev.github.io",
    "https://front-2xqe.onrender.com"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Preflight OPTIONS complet (important pour DELETE)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

/* ============================
   MONGODB
   ============================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log("Erreur MongoDB :", err));

/* ============================
   ROUTES
   ============================ */
app.use("/auth", authRoutes);

/* ============================
   SERVER
   ============================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend en ligne sur port ${PORT}`));
