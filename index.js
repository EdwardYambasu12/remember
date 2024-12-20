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








relay()

app.listen(5000, ()=>{
	console.log("server is loading on port 5000")
})
