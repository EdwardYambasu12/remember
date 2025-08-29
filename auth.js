const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");

router.use(cors());
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));

// ✅ Correct DB URI with database name
const uri = "mongodb+srv://lonescore0_db_user:S4XF9yjKDR08cs66@cluster0.ysw7fpi.mongodb.net/lonescore?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Cannot connect to MongoDB:", err.message);
  }
}
connectDB();

// ===== Schemas & Models =====
const registerSchema = new mongoose.Schema({
  email: String,
  password: String,
  favorite_team: [String],
  favorite_player: [String],
  favorite_league: [String],
  pinned_matches: [String],
  phone_string: String
});

const varSchema = new mongoose.Schema({
  variable: String,
  result_string: String,
  comm: String,
  m_news: String,
  odds: String,
  id: String,
  token: String
});

const RegisterModel = mongoose.model("User", registerSchema);
const VardModel = mongoose.model("Vard", varSchema);

// ===== Routes =====
router.post("/vari", async (req, res) => {
  try {
    const { sport, resu, com, news_m, m_odds, idm, tokenm } = req.body;

    await VardModel.deleteMany({});
    console.log("✅ All Vards deleted");

    const start = new VardModel({
      variable: sport,
      result_string: resu,
      comm: com,
      m_news: news_m,
      odds: m_odds,
      id: idm,
      token: tokenm
    });

    await start.save();
    res.json({ message: "New Vard saved" });
  } catch (err) {
    console.error("❌ Error in /vari:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/var", async (req, res) => {
  try {
    const data = await VardModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vars" });
  }
});

// Example: Register user
router.post("/register", async (req, res) => {
  try {
    const { email, password, phone_string } = req.body;
    const user = new RegisterModel({ email, password, phone_string });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
});

module.exports = { router, RegisterModel, VardModel };
