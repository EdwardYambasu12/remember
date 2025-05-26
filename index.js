require('dotenv').config();
const express = require("express")
const cors = require("cors")
//const {router}= require("./auth.js")
const bodyParser = require('body-parser');
const news = require("./news.js")
const search = require("./search.js")
const app = express()
const axios = require("axios")
const http = require("http")
require("./matchs_reload.js")
const server = http.createServer(app)
const io = require("./socket.js")

 io(server)

//const reloader = require("./reload.js")






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
    'deviceId': '735b223c-5ce2-42a0-be10-894255dcdc0e',
    'deviceToken': '',
    'lang': 'EN',
    'notifyPlate': 'YM',
    'param': '1918624',
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

res.json(response.data)
})


relay()

server.listen(5000, ()=>{
	console.log("server is loading on port 5000")
})


module.exports = server
