require('dotenv').config();
const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser');
const news = require("./news.js")
const search = require("./search.js")
const news_post = require("./post-news.js")
const app = express()
const axios = require("axios")
const http = require("http")
const co = require("./co.js")
require("./matchs_reload.js")
const server = http.createServer(app)
const io = require("./socket.js")

io(server)

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
app.use(express.urlencoded({extended : true}));

const path = require("path")
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'LoneScore API Server - Running with X-mas Token Middleware',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    tokenMiddleware: 'active',
    mongodb: 'connected'
  });
});

app.get('/ping', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is awake'
  });
});

const matches = require("./get_matches.js")
const result = require("./result.js")
const league = require("./inner_league.js")
const team = require("./team.js")
const player = require("./player.js")
const {router, model_schema, generateMatchesToken, generateMatchDetailsToken} = require("./auth.js")
const chat = require("./chat.js")

app.use(co)
app.use(news_post)
app.use(router)
app.use(league)
app.use(news)
app.use(matches)
app.use(search)
app.use(result)
app.use(team)
app.use(player)
app.use("/api/chat", chat)

const https = require('https');

PORT = process.env.PORT || 5000

const KEEP_ALIVE_URL = 'https://remember-1u57.onrender.com/ping';
const KEEP_ALIVE_INTERVAL = 60 * 1000; // 1 minute

let keepAliveCount = 0;
let lastKeepAliveSuccess = null;

const keepAlive = () => {
  const startTime = Date.now();
  
  https.get(KEEP_ALIVE_URL, (res) => {
    const responseTime = Date.now() - startTime;
    keepAliveCount++;
    lastKeepAliveSuccess = new Date();
    
    if (res.statusCode === 200) {
      console.log(`Keep-alive #${keepAliveCount} | Status: ${res.statusCode} | Response: ${responseTime}ms`);
    } else {
      console.log(`Keep-alive #${keepAliveCount} | Status: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Keep-alive #${keepAliveCount} failed:`, err.message);
  });
};

setTimeout(() => {
  console.log('Starting keep-alive system...');
  keepAlive();
  setInterval(keepAlive, KEEP_ALIVE_INTERVAL);
}, 30000);

let userData = {
  favoriteLeagues: [],
  followedTeams: [],
  followedPlayers: []
};

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: req.body.messages,
      }),
    });

    console.log(req.body.messages)

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/football", (req, res) => {
  request(
    { url: "http://server1.bdixsports.live/all/appevent_football.php" },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Error fetching remote page");
      }
      res.send(body);
    }
  );
});

app.get("/sofa_data", async(req, res)=>{
    const response = await axios.get('https://www.sofascore.com/api/v1/sport/football/scheduled-events/2025-06-02', {
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'baggage': 'sentry-environment=production,sentry-release=AFT9rB6OvaQRI45Rrx6RE,sentry-public_key=d693747a6bb242d9bb9cf7069fb57988,sentry-trace_id=afaf187405c547ab64ff8f9da339b384,sentry-sampled=false',
    'cache-control': 'max-age=0',
    'if-none-match': 'W/"83f73e0fb4"',
    'priority': 'u=1, i',
    'referer': 'https://www.sofascore.com/',
    'sec-ch-ua': '"Microsoft Edge";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sentry-trace': 'afaf187405c547ab64ff8f9da339b384-a64f3da1c76e6071-0',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0',
    'x-requested-with': 'a4d99d',
    'cookie': '_au_1d=AU1D-0100-001731185785-2YO6ID2C-5RV9; __browsiUID=93f8d3bc-42ce-4c7e-9514-2d769368b702; _ga=GA1.1.1349694092.1731185797; __qca=P0-1009788074-1731185799436; _ga_FVWZ0RM4DH=GS1.1.1731195149.3.0.1731195149.60.0.0; _cc_id=fd3b698f700d90530b559e2e0982d514; gcid_first=1dd000b1-44b3-4b0c-b8c8-b48ca0b9b7f4; _gcl_au=1.1.1727232035.1748326069; __gads=ID=32240e11b33caa02:T=1731185769:RT=1748904130:S=ALNI_MbM6DJHwKBO0DWeEQM9iVzdJ22Q1w; __gpi=UID=00000f816aca5eb8:T=1731185769:RT=1748904130:S=ALNI_MY6UwrtMgylZm8OFub5b107aMsukQ; __eoi=ID=01e73542bf89db51:T=1748345178:RT=1748904130:S=AA-AfjbErcwQRNul-rw7C0qqpFDt; _awl=2.1748904143.5-8d3982022e655ae8ce0d9225e9b4e8e3-6763652d6575726f70652d7765737431-0; gc_session_id=wlqtxe8nouz79szqyjqn; panoramaId_expiry=1748990547240; panoramaId=3898e4eff149868f9adc1fb98479a9fb927a8f07a7791faa1de8aec5ee287b78; panoramaIdType=panoDevice; FCNEC=%5B%5B%22AKsRol9gnrZT07nGB23kBQJ0nI-Y3XcRtgMyTD-slUYr6NryDTSDNmv4XLYvWsI9qyu2d3ve7V0Sf8KA_18gDkIvO1LreTs0rsqmKSu1ZYn3y3Zk-nRI8wfmWQ7BYDDTAJ8rhumce_2bjjAncFItwhBE9hgq_VtCEQ%3D%3D%22%5D%5D; cto_bundle=LDAN5l9mVkRhV0FVeUZBaFVXd3Npcm5KWkxRNFhIQlYyS2RXaTE2QXlTN2Y1QWNoS2Zjd2JJbUtCdDVSUlIlMkJyNjdsJTJGUENFR2ZHSU9ITGYzWExBQmtwOHNLVk9IUHZ6T0NZZVBWck54MjRWN1pna3VGUW1nRnVlMVMlMkJMTUcxOUVwSzdoWHF0cmExZmlMQ241clhqUU1KUHZVQ2ZTYW9WREMzVzBFQ0YlMkZmM3BtaXdlUXNaeVg0UGl6OW41SW0xaXRoVklsJTJG; _ga_HNQ9P9MGZR=GS2.1.s1748885024$o6$g0$t1748885197$j26$l0$h0'
  }
});

    console.log(response, "sofa_response")
})

app.get("/animation", async(req, res)=>{
const response = await axios.post(
  'https://api.holasports.com/gateway/match/matchLiveAnimation',
  {
    'channel': 'PC',
    'country': 'US',
    'deviceId': '735b223c-5ce2-42a0-be10-894255dcdc0e',
    'deviceToken': '',
    'lang': 'EN',
    'notifyPlate': 'YM',
    'param': req.query.id,
    'plateForm': 3,
    'st': 1748240603685,
    'timeZone': 'GMT-0',
    'version': 1
  },
  {
    headers: {
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
      'origin': 'https://holasports.com',
      'priority': 'u=1, i',
      'referer': 'https://holasports.com/',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sign': '8df4039e61b1e91960e71635d97e0584',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    }
  }
);
res.json(response.data)
})

app.get("/get_video_data", async(req, res)=>{
/*
const response = await axios.post(
  'https://api.holasports.com/gateway/match/period/queryHotMatchList',
  {
    'channel': 'PC',
    'country': 'US',
    'deviceId': '21061479-df27-4a97-8649-53224eb0a8a2',
    'deviceToken': '',
    'lang': 'EN',
    'notifyPlate': 'YM',
    'param': {},
    'plateForm': 3,
    'st': 1743543492107,
    'timeZone': 'GMT-0',
    'version': 1
  },
  {
    headers: {
      'sign': '8c0201d641b4e47f38db0be8a8e9e6ff',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://holasports.com/en'
    }
  }
);
*/
res.json({})
})

let lastTokenGenerationTime = null;
const TOKEN_MAX_AGE = 9 * 60 * 1000;

async function autoGenerateTokens() {
    try {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const timezone = 'Africa%2FMonrovia';
        const ccode3 = 'LBR';
        const matchId = '4822533';
        
        // Generate fresh tokens
        const matchesToken = generateMatchesToken(date, timezone, ccode3);
        const matchDetailsToken = generateMatchDetailsToken(matchId);
        
        // Delete old tokens
        await model_schema.deleteMany({});
        
        // Save new tokens to database
        const tokenData = new model_schema({
            variable: matchesToken,
            result_string: matchDetailsToken,
            comm: '',
            m_news: '',
            odds: '',
            id: '',
            token: ''
        });
        
        await tokenData.save();
        
        // Update last generation time
        lastTokenGenerationTime = Date.now();
        
        console.log(`[${new Date().toISOString()}] Tokens generated and saved`);
        console.log(`Date: ${date}`);
        console.log(`Next refresh: ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()}`);
        
    } catch (error) {
        console.error('Token generation error:', error);
    }
}

app.use(async (req, res, next) => {
    // Skip for static files, health checks, and ping endpoint
    if (req.path.startsWith('/public') || req.path === '/' || req.path === '/api/status' || req.path === '/ping') {
        return next();
    }
    
    // Check if tokens are stale
    const now = Date.now();
    const tokenAge = lastTokenGenerationTime ? now - lastTokenGenerationTime : Infinity;
    
    if (tokenAge > TOKEN_MAX_AGE) {
        console.log(`[WAKE-UP DETECTED] Tokens are ${Math.round(tokenAge / 60000)} minutes old`);
        console.log(`Regenerating tokens immediately...`);
        
        // Regenerate tokens immediately
        await autoGenerateTokens();
    }
    
    next();
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

server.listen(PORT, async ()=>{
    console.log(`\n${'='.repeat(60)}`);
    console.log(`LoneScore Server Started`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Server: ${PORT}`);
    console.log(`Starting automatic token generation...`);
    await autoGenerateTokens();
    const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;
    setInterval(autoGenerateTokens, TOKEN_REFRESH_INTERVAL);
    console.log(`Token auto-refresh scheduled every 10 minutes`);
    console.log(`Wake-up detection enabled (auto-refresh on stale tokens)`);
    
    console.log(`${'='.repeat(60)}\n`);
})

module.exports = server
