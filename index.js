require('dotenv').config();
const express = require("express")
const cors = require("cors")
//const {router}= require("./auth.js")
const bodyParser = require('body-parser');
const news = require("./news.js")
const search = require("./search.js")
const app = express()
const axios = require("axios")

const reloader = require("./reload.js")

const matches = require("./get_matches.js")
const result = require("./result.js")
const league = require("./inner_league.js")
const team = require("./team.js")
const player = require("./player.js")
const path = require("path")


app.use(express.static(path.join(__dirname, "public")))

const {router} = require("./auth.js")

// Increase the limit for JSON payloads
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed

// For URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(router)
app.use(cors())
app.use(league)
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(express.urlencoded({extended : true}), bodyParser.urlencoded({ limit: '50mb', extended: true }) )
app.use(news)
app.use(matches)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(search)				
app.use(result)
app.use(team)
app.use(player)
const https = require('https');

 // Replace with your actual HTTPS URL
const keepAlive = () => {
	const url =   "https://remember-0j3b.onrender.com/"
https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  // Collect response data (if needed)
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Data:', data); // Log full response
  });

}).on('error', (err) => {
  console.error('Request Error:', err.message);
});

}	

setTimeout(keepAlive, 300000)

function relay(){

		console.log("praise the Lord")
	setTimeout(relay, 30000)
}


app.get("/animation", async(req, res)=>{
  const response = await axios.post(
  'https://api.holasports.com/gateway/match/matchLiveAnimation',
  {
    'channel': 'PC',
    'country': 'US',
    'deviceId': '3ec14d60-e651-44cb-95de-4893a10674a3',
    'deviceToken': '',
    'lang': 'EN',
    'notifyPlate': 'YM',
    'param': req.query.id,
    'plateForm': 3,
    'st': 1739906822498,
    'timeZone': 'GMT-0',
    'version': 1
  },
  {
    headers: {
      'accept-language': 'en-US,en;q=0.9',
      'origin': 'https://holasports.com',
      'priority': 'u=1, i',
      'referer': 'https://holasports.com/',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sign': 'ba56f049fd3325e7cfdc65316f22f1e3',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0'
    }
  }
);


res.json(response.data)
})

app.get("/get_video_data", async(req, res)=>{

const response = await axios.post(
  'https://api.holasports.com/gateway/live/broadcast/period/queryHotMatchList',
  {
    'channel': 'PC',
    'country': 'US',
    'deviceId': '3ec14d60-e651-44cb-95de-4893a10674a3',
    'deviceToken': '',
    'lang': 'EN',
    'notifyPlate': 'YM',
    'param': {},
    'plateForm': 3,
    'st': 1739906721044,
    'timeZone': 'GMT-0',
    'version': 1
  },
  {
    headers: {
      'accept-language': 'en-US,en;q=0.9',
      'origin': 'https://holasports.com',
      'priority': 'u=1, i',
      'referer': 'https://holasports.com/',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sign': 'af07903ae6baf46986a7470227093771',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0'
    }
  }
);

res.json(response.data)
})


relay()

app.listen(5000, ()=>{
	console.log("server is loading on port 5000")
})
