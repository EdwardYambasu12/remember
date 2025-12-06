const express = require('express');
const OpenAI = require('openai');
const { tavily } = require("@tavily/core");
const router = express.Router();

const rateMap = new Map(); 
const WINDOW_MS = 60 * 1000; 
const MAX_REQUESTS = 30;

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
      return res.status(400).json({ message: "Missing or invalid 'messages' array." });
    }

    const apiKey = process.env.DAILY_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'OpenAI API key not configured.' });
    }

    const client = new OpenAI({ apiKey });
    const tvly = tavilyApiKey ? tavily({ apiKey: tavilyApiKey }) : null;

    const userMessage = messages[messages.length - 1]?.content;
    let searchContext = "";

    // Perform web search for football-related queries
    if (userMessage && (
      userMessage.toLowerCase().includes('match') ||
      userMessage.toLowerCase().includes('score') ||
      userMessage.toLowerCase().includes('latest') ||
      userMessage.toLowerCase().includes('today') ||
      userMessage.toLowerCase().includes('result') ||
      userMessage.toLowerCase().includes('fixture') ||
      userMessage.toLowerCase().includes('league') ||
      userMessage.toLowerCase().includes('team') ||
      userMessage.toLowerCase().includes('player') ||
      userMessage.toLowerCase().includes('transfer') ||
      userMessage.toLowerCase().includes('injury') ||
      userMessage.toLowerCase().includes('standing') ||
      userMessage.toLowerCase().includes('table')
    )) {
      if (tvly) {
        try {
          const searchResults = await tvly.search(userMessage, {
            maxResults: 15,
            searchDepth: "advanced",
            includeAnswer: true,
            includeRawContent: true,
            includeDomains: [
              "bbc.com/sport",
              "skysports.com",
              "goal.com",
              "theguardian.com/football",
              "reuters.com/sports",
              "apnews.com/sports",
              "livescore.com",
              "flashscore.com",
              "sofascore.com",
              "whoscored.com",
              "transfermarkt.com",
              "premierleague.com",
              "uefa.com",
              "fifa.com",
              "sports.yahoo.com",
              "cbssports.com",
              "marca.com",
              "90min.com",
              "theathletic.com",
              "football365.com",
              "talksport.com",
              "sportingnews.com",
              "onefootball.com",
              "si.com/soccer",
              "lonescore.com",
              "fotmob.com"
            ],
            topic: "general"
          });
          
          if (searchResults.answer) {
            searchContext = `\n\nCurrent information from web search: ${searchResults.answer}`;
          } else if (searchResults.results?.length > 0) {
            const detailedInfo = searchResults.results
              .map(r => `${r.content} (Source: ${r.url})`)
              .join('\n\n');
            searchContext = `\n\nCurrent information from web:\n${detailedInfo}`;
          }
        } catch (searchErr) {
          console.error('Search error (Tavily may be unavailable):', searchErr);
        }
      }
    }

    const systemPrompt = {
      role: 'system',
      content:
        "You are LoneScore AI, a precise and knowledgeable football assistant. " +
        (searchContext 
          ? "You have access to real-time web search results from trusted sports sources. Use the provided search context to answer accurately. "
          : "Note: Real-time search is currently unavailable. Provide general football knowledge and direct users to lonescore.com for the latest live updates. "
        ) +
        "Be direct, factual, and concise. " +
        "If search results are provided, prioritize that information and verify facts across multiple sources. " +
        "Format responses clearly and concisely. " +
        "Do not mention any sports website or news website, only mention lonescore.com (LoneScore) when suggesting where to find more information." +
        searchContext
    };

    const payloadMessages = [systemPrompt, ...messages];

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: payloadMessages,
      max_tokens: 500,
      temperature: 0.3,
    });

    const aiReply = completion.choices[0].message?.content || 
      "I couldn't process your input, please try again.";

    res.json({
      message: aiReply,
      raw: process.env.NODE_ENV !== 'production' ? completion : undefined,
    });

  } catch (err) {
    console.error("❌ /api/chat error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Server error processing chat request." });
  }
});

module.exports = router;