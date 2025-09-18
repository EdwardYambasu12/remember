const  express = require ("express");
const crypto = require ("crypto");
const fetch = require ("node-fetch");
const { URL } = require ("url");
const cors = require ("cors")



const app = express.Router();
const PORT = 5000;




app.use(cors())

// Store one-time tokens (replace with DB in production)
const tokens = new Map();

const realLink = "http://server1.bdixsports.live/all/appevent_football.php";

// Step 1: Generate one-time encrypted URL
app.get("/generate-link", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  tokens.set(token, { used: false });

  const oneTimeUrl = `https://remember-1u57.onrender.com/one-time/${token}`;
  res.json({ url: oneTimeUrl });
});

// Step 2: Validate & allow access only once
app.get("/one-time/:token", (req, res) => {
  const { token } = req.params;
  const entry = tokens.get(token);

  if (!entry || entry.used) {
    return res.status(403).send("❌ This link has expired.");
  }

  // Mark as used
  entry.used = true;
  tokens.set(token, entry);

  // Option A: Redirect (but user will see final link in browser bar)
  // res.redirect(realLink);

  // Option B: Proxy without exposing the real link
  res.setHeader("content-type", "text/html");
  res.end(`
    <iframe src="${realLink}" style="width:100%;height:100%;border:none;"></iframe>
  `);
});
module.exports = app
