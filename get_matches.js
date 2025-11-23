const express = require("express")
const axios = require("axios")
const { generateXmasToken } = require("./auth.js");
const { getOrGenerateToken } = require('./tokenMiddleware');
const matches = express.Router()

// ✅ Update /man endpoint
matches.get("/man", async(req, res)=>{
  try {
    const token = await getOrGenerateToken('matches', {
      date: '20241030',
      timezone: 'Africa%2FMonrovia',
      ccode3: 'LBR'
    });
    
    console.log("Using token:", token)
    
    const response = await axios.get('https://www.fotmob.com/api/matches', {
      params: {
        'date': '20241030',
        'timezone': 'Africa/Monrovia',
        'ccode3': 'LBR'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data)
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
})

// ✅ Update /audio_matches endpoint
matches.get("/audio_matches", async (req, res)=>{
  try {
    const token = await getOrGenerateToken('default', {
      urlPath: '/api/audio-matches'
    });

    const response = await axios.get('https://www.fotmob.com/api/audio-matches', {
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data)
  } catch (error) {
    console.error('Error fetching audio matches:', error);
    res.status(500).json({ error: 'Failed to fetch audio matches' });
  }
})

// ✅ Already updated
matches.get("/match", async(req, res)=>{
  try {
    const { date, timeZone, code } = req.query;
    
    const token = await getOrGenerateToken('matches', {
      date: date || new Date().toISOString().split('T')[0].replace(/-/g, ''),
      timezone: timeZone,
      ccode3: code
    });

    const response = await axios.get('https://www.fotmob.com/api/matches', {
      params: {
        'date': date,
        'timezone': timeZone,
        'ccode3': code
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
})

// ✅ Update /all_leagues endpoint
matches.get("/all_leagues", async (req, res)=>{
  try {
    const token = await getOrGenerateToken('default', {
      urlPath: '/api/allLeagues?locale=en&country=INT'
    });

    const response = await axios.get('https://www.fotmob.com/api/allLeagues', {
      params: {
        'locale': 'en',
        'country': 'INT'
      },
      headers: {
        'x-mas': token,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': 'https://www.fotmob.com/'
      }
    });

    res.json(response.data)
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
})

// Image proxy endpoints don't need x-mas tokens
matches.get('/proxy', async (req, res) => {
  const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: { url, w, q },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

matches.get('/roxy', async (req, res) => {
  const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: { url, w, q },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

matches.get('/player_pic', async (req, res) => {
  const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: { url, w, q },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

module.exports = matches