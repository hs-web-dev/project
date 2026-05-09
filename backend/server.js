import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// CORS : autorise ton site GitHub Pages
app.use(cors({
  origin: "https://hs-web-dev.github.io",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Connexion MongoDB (Render → Environment → MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

// Modèle utilisateur
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

// REGISTER
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ success: false, message: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({ email, password: hash });

  res.json({ success: true });
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ success: false });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ success: true, token });
});

// Lancer serveur
<<<<<<< HEAD
app.listen(3000, () => console.log("Backend en ligne sur port 3000"));
=======
app.listen(3000, () => console.log("Backend en ligne sur port 3000"));
>>>>>>> 58b86651903c6fc91a6bb546771576af837f3446
