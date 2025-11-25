const express = require("express")
const axios = require("axios")
const { getOrGenerateToken } = require('./tokenMiddleware');

const result = express.Router()

// ✅ Update /strong endpoint
result.get("/strong", async (req, res)=>{
  try {
    const token = await getOrGenerateToken('matchDetails', { matchId: '4535423' });
    
    const response = await axios.get('https://www.fotmob.com/api/matchDetails', {
      params: { 'matchId': '4535423' },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data)
  } catch (e) {
    console.error('Strong endpoint error:', e);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
})

// ✅ Already updated
result.get("/result", async(req, res)=>{
  try {
    const id = req.query.id;
    const token = await getOrGenerateToken('matchDetails', { matchId: id?.id });

    const response = await axios.get('https://www.fotmob.com/api/matchDetails', {
      params: { 'matchId': id.id },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch (e) {
    console.error('Match details error:', e);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
})

// ✅ Already updated
result.get("/match_odds", async(req, res)=>{
  try {
    const token = await getOrGenerateToken('odds', { 
      urlPath: `/api/matchOdds?matchId=${req.query.id.id}&ccode3=INT` 
    });

    const response = await axios.get('https://www.fotmob.com/api/matchOdds', {
      params: {
        'matchId': req.query.id.id,
        'ccode3': 'INT'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Match odds error:', e);
    res.status(500).json({ error: 'Failed to fetch match odds' });
  }
})

// ✅ Update /match_news endpoint
result.get("/match_news", async(req, res)=>{
  try {
    const token = await getOrGenerateToken('news', {
      urlPath: `/api/matchNews?id=${req.query.id}&ccode3=LBR&lang=en`
    });

    const response = await axios.get('https://www.fotmob.com/api/matchNews', {
      params: {
        'id': req.query.id,
        'ccode3': 'LBR',
        'lang': 'en'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data)
  } catch(e) {
    console.error('Match news error:', e);
    res.status(500).json({ error: 'Failed to fetch match news' });
  }
})

// ✅ Updated commentary endpoint with proper token generation
result.get("/commentary", async(req, res)=>{
  try {
    const data = req.query;
    
    // Parse the teams if they come as a JSON string
    let teams = data.first;
    if (typeof teams === 'string') {
      try {
        teams = JSON.parse(teams);
      } catch (e) {
        console.error('Failed to parse teams:', e);
      }
    }
    
    // Parse the languages if they come as a JSON string
    let languages = data.arr;
    if (typeof languages === 'string') {
      try {
        languages = JSON.parse(languages);
      } catch (e) {
        console.error('Failed to parse languages:', e);
      }
    }
    
    const stringy = JSON.stringify(teams);
    
    let inc;
    if(languages.includes("en")) {
      inc = "en";
    } else if(languages.includes("en_gen")) {
      inc = "en_gen";
    } else {
      inc = languages[1];
    }

    const ltcUrl = `http://data.fotmob.com/webcl/ltc/gsm/${data.id}_${inc}.json.gz`;
    
    // Generate the URL path exactly as FotMob expects it
    // IMPORTANT: stringy is already a JSON string, so we encode it once
    const urlPath = `/api/data/ltc?ltcUrl=${encodeURIComponent(ltcUrl)}&teams=${encodeURIComponent(stringy)}`;
        
    // Force fresh token generation for commentary (tokens are request-specific)
    const token = await getOrGenerateToken('commentary', { 
      urlPath,
      forceRefresh: true
    });
    
    if (!token) {
      console.error('❌ Token generation failed!');
      return res.status(500).json({
        error: 'Token generation failed',
        matchId: data.id
      });
    }
    
    const response = await axios.get('https://www.fotmob.com/api/data/ltc', {
      params: {
        'ltcUrl': ltcUrl,
        'teams': stringy  // Send the JSON string directly
      },
      headers: {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'x-mas': token,
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      }
    });

    if (response.data === null || response.data === undefined) {
      console.warn('⚠️ FotMob returned null for this match');
      return res.status(404).json({
        error: 'No commentary data available',
        matchId: data.id,
        language: inc,
        message: 'Commentary data not available for this match'
      });
    }

    res.json(response.data);
    
  } catch(e) {
    console.error('❌ Commentary error:', e.message);
    if (e.response) {
      console.error('HTTP Status:', e.response.status);
      console.error('Response data:', e.response.data);
    }
    res.status(500).json({ 
      error: 'Failed to fetch commentary',
      details: e.message,
      matchId: req.query.id
    });
  }
})

// ✅ Update /audio_commentary endpoint
result.get("/audio_commentary", async(req, res)=>{
  try {
    const { id } = req.query;
    
    const token = await getOrGenerateToken('default', {
      urlPath: `/api/audio-live-stream?id=${id}&acceptLangs=en-US&userLang=en`
    });

    const response = await axios.get('https://www.fotmob.com/api/audio-live-stream', {
      params: {
        'id': id,
        'acceptLangs': 'en-US',
        'userLang': 'en'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token,
        'Referer': 'https://www.fotmob.com/'
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Audio commentary error:', e);
    res.status(500).json({ error: 'Failed to fetch audio commentary' });
  }
})

module.exports = result