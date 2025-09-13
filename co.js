const express = require("express");
const axios = require("axios");
const request = require("request")
const app = express.Router();
const PORT = process.env.PORT || 5000;



// Catch "appevent_football_player.php" requests and pipe to /proxy-stream


// -------- Proxy HTML pages --------
app.get("/proxy-html", (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  request({ url: targetUrl }, (error, response, body) => {
    if (error) {
      return res.status(500).send("Error fetching remote page");
    }
    res.send(body);
  });
});

// Proxy for football main page
app.get("/football", (req, res) => {
  request(
    { url: "http://server1.bdixsports.live/all/appevent_football.php" },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Error fetching remote page");
      }
      res.send(body);
    }
  );
});

// Proxy for football player pages
app.get("/appevent_football_player.php", (req, res) => {
  const mediaUrl = req.query.media;
  if (!mediaUrl) {
    return res.status(400).send("Missing media url");
  }

  const targetUrl = `http://server1.bdixsports.live/all/appevent_football_player.php?media=${encodeURIComponent(mediaUrl)}`;

  request({ url: targetUrl }, (error, response, body) => {
    if (error) {
      return res.status(500).send("Error fetching player page");
    }
    res.send(body);
  });
});


// -------- Proxy video streams --------
app.get("/proxy-stream", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url"); 

  try {
    console.log("Streaming URL:", url);
    const response = await axios.get(url, { responseType: "stream" });

    // Set correct content type (m3u8, ts, mp4)
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/vnd.apple.mpegurl"
    );

    response.data.pipe(res);
  } catch (err) {
    console.error("Proxy stream error:", err.message);
    res.status(500).send("Error fetching stream");
  }
});


module.exports = app
