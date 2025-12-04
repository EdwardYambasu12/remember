const express = require('express');
const axios = require('axios');

const router = express.Router();

// Simple in-memory rate limiter per IP (small projects only)
const rateMap = new Map(); // ip -> { count, firstTs }
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, firstTs: now };
  if (now - entry.firstTs > WINDOW_MS) {
    entry.count = 1;
    entry.firstTs = now;
    rateMap.set(ip, entry);
    return true;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count <= MAX_REQUESTS;
}

router.post('/', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ message: 'Too many requests, slow down.' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Missing or invalid 'messages' array in request body." });
    }

    const systemPrompt = {
      role: 'system',
      content:
        "You are LoneScore AI, a precise and knowledgeable football assistant. " +
        "Provide direct, accurate, and concise answers about football matches, teams, players, leagues, statistics, fixtures, and results. " +
        "Be straightforward and factual in your responses. If you don't have specific real-time data, acknowledge it and provide general football knowledge instead. " +
        "Keep responses brief but informative. Use simple language and avoid unnecessary elaboration. " +
        "Focus on delivering the exact information requested without extra context unless asked. " +
        "If a question is unclear, ask for clarification in one short sentence."
    };

    const payload = {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [systemPrompt, ...messages],
      max_tokens: 300,
      temperature: 0.3,
    };

    const apiKey = process.env.DAILY_API_KEY;
    console.log('Using OpenAI API Key:', apiKey ? 'configured' : 'NOT configured');
    if (!apiKey) return res.status(500).json({ message: 'OpenAI API key not configured on server.' });
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 30 * 1000,
    });

    const data = response.data;
    const aiReply = data?.choices?.[0]?.message?.content || 'I couldn\'t process your input, please try again.';
    return res.json({ message: aiReply, raw: process.env.NODE_ENV !== 'production' ? data : undefined });
  } catch (err) {
    console.error('❌ /api/chat error:', err?.response?.data || err.message || err);
    return res.status(500).json({ message: 'Server error processing chat request.' });
  }
});

module.exports = router;
