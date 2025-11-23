const express = require("express")
const axios = require("axios")
const { model_schema } = require("./auth.js");
const { getOrGenerateToken } = require('./tokenMiddleware');
const player = express.Router()

player.get("/player", async(req, res)=>{
  try {
    const playerId = req.query.id;
    
    const token = await getOrGenerateToken('matchDetails', { 
      matchId: playerId 
    });

    const response = await axios.get('https://www.fotmob.com/api/playerData', {
      params: { 'id': playerId },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch (e) {
    console.error('Player error:', e);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
})

module.exports = player


