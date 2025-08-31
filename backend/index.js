import axios from "axios";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ----------------- MongoDB -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ----------------- User Model -----------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// ----------------- Mood Model -----------------
const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mood: String,
  tracks: [
    { name: String, artist: String, url: String, cover: String },
  ],
  date: { type: Date, default: Date.now },
});

const MoodHistory = mongoose.model("MoodHistory", moodSchema);

// ----------------- JWT Middleware -----------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
}

// ----------------- Spotify Access Token -----------------
let accessToken = null;

async function getAccessToken() {
  const result = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );
  accessToken = result.data.access_token;
}

// ----------------- Auth Routes -----------------
// Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ----------------- Mood Routes -----------------
// Post mood & fetch Spotify tracks
app.post("/api/mood", authMiddleware, async (req, res) => {
  const { mood } = req.body;
  if (!accessToken) await getAccessToken();

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${mood}&type=track&limit=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const tracks = response.data.tracks.items.map((t) => ({
      name: t.name,
      artist: t.artists[0].name,
      url: t.external_urls.spotify,
      cover: t.album.images[0]?.url || "",
    }));

    const newEntry = new MoodHistory({ userId: req.userId, mood, tracks });
    await newEntry.save();

    res.json({ mood, tracks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get last 10 moods for logged-in user
app.get("/api/history", authMiddleware, async (req, res) => {
  const history = await MoodHistory.find({ userId: req.userId })
    .sort({ date: -1 })
    .limit(10);
  res.json(history);
});

// ----------------- Start Server -----------------
app.listen(5001, () => console.log("Server running on port 5001"));
