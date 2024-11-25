const express = require("express")
const axios = require("axios")
const team = express.Router()

const { model_schema } = require("./auth.js");
team.get("/team", async(req, res)=>{
const data = await model_schema.find()
	try{
const response = await axios.get('https://www.fotmob.com/api/teams', {
  params: {
    'id': req.query.id,
    'ccode3': 'LBR'
  },
  headers: {
    'x-mas':data[0]["result_string"],
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
	const response = await axios.get('https://www.fotmob.com/api/tlnews', {
  params: {
    'id': req.query.id,
    'type': 'team',
    'language': 'en',
    'startIndex': '0'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; g_state={"i_p":1732733726602,"i_l":4}; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.62%22%7D; cto_bundle=en9HCl9mVkRhV0FVeUZBaFVXd3Npcm5KWkxWSTdFM1dwQjExZE1Cbjg2WCUyQnVCM2UyTHhleSUyQnhCQWhCQlNyV3JXT1FZaWVFJTJCSFdMcXVneU5HMkczTDREQTB4SEFFZ3NIS0c0T2FJenlxMWlKZHQwSU1zNU53TUFRRnR6dUw1WDZBMUI1UEFGM2JzcnNwUlRZVTZtUXUwOWclMkZTQSUzRCUzRA; panoramaId_expiry=1730542511783; _ga_G0V1WDW9B2=GS1.1.1730459802.41.1.1730460187.0.0.0; __gads=ID=92d5d724039964be:T=1718667552:RT=1730460188:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730460188:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730460188:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; FCNEC=%5B%5B%22AKsRol8qEmLZUtw0K2eVHt9RzKdc_V4fXDHQyT4wY687STB4K_5itrFc6fYR8zdS-0tTFp_B0TnvCRQV7NNEI2SNw_XAMPH8uROFkD1FiLGrXXB9Ihqsu4ltqYwlrEnSFkLqixIpadsg-En6N_oMriIpYELFDHgR7w%3D%3D%22%5D%5D',
    'if-none-match': '"i34f22978t7d9"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/teams/9866/overview/deportivo-alaves',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': 'eyJib2R5Ijp7InVybCI6Ii9hcGkvdGxuZXdzP2lkPTk4NjYmdHlwZT10ZWFtJmxhbmd1YWdlPWVuJnN0YXJ0SW5kZXg9MCIsImNvZGUiOjE3MzA0NjA5MDY5MzJ9LCJzaWduYXR1cmUiOiI4NDU1QjgzMzE0Mjk0NDYzQUMxQTg3MzQ3ODA5NEY5RiJ9'
  }
});
	res.json(response.data)
})

module.exports = team