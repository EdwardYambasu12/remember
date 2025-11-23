const express = require("express")
const axios = require("axios")
const { model_schema } = require("./auth.js");
const { getOrGenerateToken } = require('./tokenMiddleware');
const league = express.Router()

league.get("/round", async(req, res)=>{
  try {
    const { id, season } = req.query;
    console.log('Fetching rounds:', { id, season });
    
    const token = await getOrGenerateToken('matchDetails', { 
      matchId: id 
    });

    const response = await axios.get('https://www.fotmob.com/api/team-of-the-week/rounds', {
      params: {
        'leagueId': id,
        'season': season
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token,
        'Referer': 'https://www.fotmob.com/leagues/'
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Rounds error:', e);
    res.status(500).json({ error: 'Failed to fetch rounds' });
  }
})

league.get("/totw", async(req, res)=>{
  try {
    const { id, round, season } = req.query;
    console.log('Fetching TOTW:', { id, round, season });
    
    const token = await getOrGenerateToken('matchDetails', { 
      matchId: id 
    });

    const response = await axios.get('https://www.fotmob.com/api/team-of-the-week/team', {
      params: {
        'leagueId': id,
        'roundId': round,
        'season': season,
        'isV4': 'true'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });
    
    res.json(response.data);
  } catch(e) {
    console.error('TOTW error:', e);
    res.status(500).json({ error: 'Failed to fetch team of the week' });
  }
})

league.get("/league", async(req, res)=>{
  try {
    const leagueId = req.query.id;
    
    const token = await getOrGenerateToken('matchDetails', { 
      matchId: leagueId 
    });

    const response = await axios.get('https://www.fotmob.com/api/leagues', {
      params: {
        'id': leagueId,
        'ccode3': 'LBR'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'If-Modified-Since': '0',
        'x-mas': token
      }
    });
    
    res.json(response.data);
  } catch(e) {
    console.error('League error:', e);
    res.status(500).json({ error: 'Failed to fetch league data' });
  }
})

league.get("/league_news", async(req, res)=>{
  try {
    const leagueId = req.query.id;
    
    const token = await getOrGenerateToken('news', {
      urlPath: `/api/tlnews?id=${leagueId}&type=league&language=en&startIndex=0`
    });

    const response = await axios.get('https://www.fotmob.com/api/tlnews', {
      params: {
        'id': leagueId,
        'type': 'league',
        'language': 'en',
        'startIndex': '0'
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });
    
    res.json(response.data);
  } catch(e) {
    console.error('League news error:', e);
    res.status(500).json({ error: 'Failed to fetch league news' });
  }
})

module.exports = league