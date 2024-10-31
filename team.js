const express = require("express")
const axios = require("axios")
const team = express.Router()


team.get("/team", async(req, res)=>{

	try{
const response = await axios.get('https://www.fotmob.com/api/teams', {
  params: {
    'id': req.query.id,
    'ccode3': 'LBR'
  },
  headers: {
    'x-fm-req': 'eyJib2R5Ijp7InVybCI6Ii9hcGkvdGVhbXM/aWQ9MTAyMzMmY2NvZGUzPUxCUiIsImNvZGUiOjE3MzAzMzU5NDE1NjZ9LCJzaWduYXR1cmUiOiIyNTE0NkU4ODc1MTEwOTU2RkJCOUNGNUU0Q0E3RUVDMCJ9',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'Referer': 'https://www.fotmob.com/teams/10233/overview/genoa'
  }
});

res.json(response.data)
}

catch(e){
	console.log(e)
}
})


team.get("/team_news", async(req, res)=>{
	const response = await axios.get("https://www.fotmob.com/api/tlnews?id="+req.query.id+"&type=team&language=en&startIndex=0");
	res.json(response.data)
})

module.exports = team