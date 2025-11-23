const express = require("express")
const axios = require("axios")
const { getOrGenerateToken } = require('./tokenMiddleware');

const team = express.Router()

const { model_schema } = require("./auth.js");
team.get("/team", async(req, res)=>{
  try {
    const teamId = req.query.id;
    
    const token = await getOrGenerateToken('matchDetails', { 
      matchId: teamId 
    });

    const response = await axios.get('https://www.fotmob.com/api/teams', {
      params: {
        'id': teamId,
        'ccode3': 'LBR'
      },
      headers: {
        'x-mas': token,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': 'https://www.fotmob.com/teams/'
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Team error:', e);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
})

team.get("/team_news", async(req, res)=>{
  try {
    const teamId = req.query.id;
    
    const token = await getOrGenerateToken('news', {
      urlPath: `/api/tlnews?id=${teamId}&type=team&language=en&startIndex=0`
    });

    const response = await axios.get('https://www.fotmob.com/api/tlnews', {
      params: {
        'id': teamId,
        'type': 'team',
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
    console.error('Team news error:', e);
    res.status(500).json({ error: 'Failed to fetch team news' });
  }
})

module.exports = team