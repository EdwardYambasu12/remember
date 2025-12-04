const api = "./details.js"
const axios = require("axios")
const express = require("express")
const { getOrGenerateToken } = require('./tokenMiddleware');

const search = express.Router()

search.get("/search", async(req, res)=>{
  try {
    const { term } = req.query;
    
    const token = await getOrGenerateToken('default', {
      urlPath: `/api/data/search/suggest?hits=50&lang=en&term=${term}`
    });

    const response = await axios.get('https://www.fotmob.com/api/data/search/suggest', {
      params: {
        'hits': '100',
        'lang': 'en',
        'term': term
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ error: 'Failed to search' });
  }
})

module.exports = search