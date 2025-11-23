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

// ✅ Update /commentary endpoint
result.get("/commentary", async(req, res)=>{
  try {
    const data = req.query;
    const teams = data.first;
    const stringy = JSON.stringify(data.first);
    
    let inc;
    if(data.arr.includes("en")) {
      inc = "en";
    } else if(data.arr.includes("en_gen")) {
      inc = "en_gen";
    } else {
      inc = data.arr[1];
    }

    const ltcUrl = `data.fotmob.com/webcl/ltc/gsm/${data.id}_${inc}.json.gz`;
    const token = await getOrGenerateToken('commentary', {
      urlPath: `/api/ltc?ltcUrl=${ltcUrl}&teams=${stringy}`
    });

    const response = await axios.get('https://www.fotmob.com/api/ltc', {
      params: {
        'ltcUrl': ltcUrl,
        'teams': stringy 
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Commentary error:', e);
    res.status(500).json({ error: 'Failed to fetch commentary' });
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