const express = require("express")
const axios = require("axios")
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const { getOrGenerateToken } = require('./tokenMiddleware');

const news = express.Router()

news.use(bodyParser.json({ limit: '150mb' }));
news.use(bodyParser.urlencoded({ limit: '1550mb', extended: true }));

news.get("/sportsup_news", async(req, res)=>{
  try {
    const page = req.query.page;
    console.log('Fetching news page:', page);
    
    const token = await getOrGenerateToken('news', {
      urlPath: `/api/worldnews?lang=en&page=${page}`
    });

    const response = await axios.get('https://www.fotmob.com/api/worldnews', {
      params: {
        'lang': 'en',
        'page': page
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('News error:', e);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
})

news.get("/latest_news", async(req, res)=>{
  try {
    const startIndex = req.query.startIndex || 0;
    const page = req.query.page || 1;
    
    const token = await getOrGenerateToken('news', {
      urlPath: `/api/news/latestNews?startIndex=${startIndex}&lang=en-GB&page=${page}`
    });

    const response = await axios.get('https://www.fotmob.com/api/news/latestNews', {
      params: {
        'startIndex': startIndex,
        'lang': 'en-GB',
        'page': page
      },
      headers: {
        'accept': '*/*',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
        'x-mas': token
      }
    });

    res.json(response.data);
  } catch(e) {
    console.error('Latest news error:', e);
    res.status(500).json({ error: 'Failed to fetch latest news' });
  }
})

news.get("/top", async(req, res)=>{
  try {
    const token = await getOrGenerateToken('default', {
      urlPath: '/_next/data/news'
    });

    const response = await axios.get('https://www.fotmob.com/_next/data/Pm9s-k1eBdZRV0SAYyMEy/en/news/9r9wvy7lyoal1wgz45t3r8ozo-israel-0-2-italy-frattesi-kean-keep-azzurri-perfect.json', {
      params: { 'id': '9r9wvy7lyoal1wgz45t3r8ozo' },
      headers: {
        'x-nextjs-data': '1',
        'Referer': 'https://www.fotmob.com/news',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
      }
    });
    
    res.json(response.data);
  } catch(e) {
    console.error('Top news error:', e);
    res.status(500).json({ error: 'Failed to fetch top news' });
  }
})

module.exports = news