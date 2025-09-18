const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express.Router();
app.use(cors());

// Store one-time tokens (replace with DB in production)
const tokens = new Map();

// Remote PHP link
const realLink = "http://server1.bdixsports.live/all/appevent_football.php";

// Step 1: Generate one-time URL
app.get("/generate-link", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  tokens.set(token, { used: false });

  const oneTimeUrl = `http://localhost:5000/one-time/${token}`;
  res.json({ url: oneTimeUrl });
});

// Step 2: Validate & redirect once
app.get("/one-time/:token", (req, res) => {
  const { token } = req.params;
  const entry = tokens.get(token);

  if (!entry) return res.status(404).send("❌ Invalid link.");
  if (entry.used) return res.status(403).send("❌ This link has already been used.");

  // Mark token as used
  entry.used = true;
  tokens.set(token, entry);

  // Redirect to the PHP page
  res.redirect(realLink);
});

module.exports = app;
