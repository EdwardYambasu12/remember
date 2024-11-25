const express = require("express")
const axios = require("axios")
const { model_schema } = require("./auth.js");
const player = express.Router()


player.get("/player", async(req, res)=>{

	try{

const data = await model_schema.find()
const response = await axios.get('https://www.fotmob.com/api/playerData', {
	
  params: {
    'id': req.query.id
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; g_state={"i_p":1732733726602,"i_l":4}; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; cto_bundle=2gXfoF9mVkRhV0FVeUZBaFVXd3Npcm5KWkxTQnZTeURkTDk0YU5zWjJCNW9WcGlCVWlSVjhjbnJmZkpmUE9UaE94RW8lMkZnb0k2VFZEMkk3VDg0ZTg3eXNZT1EyUVVZVlR2SUVQRFJXTXRHS3NRTE90VGdGSG5TRSUyRm1ialFXVTRpQ3VZNXBIUWR3NGVDbzdQbXJUR2R2SEEyYTB3JTNEJTNE; __gads=ID=92d5d724039964be:T=1718667552:RT=1730329477:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730329477:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730329477:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; FCNEC=%5B%5B%22AKsRol-Qpg2Z5E78oox_XpZ0LfBzZjAIJBIslmolL6XpQC-Pq8DKDeb-bxW8itybeHm1VMGdH1GdvHf3dj8pfSndxK_VpQl6EihMN8gaRKZg3B6W9vujpnxMUNwl-kZWjx3FGzcYjIcaU4Y-RtPQcideyTrtCQp33g%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1730328700.38.1.1730329481.0.0.0',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/players/846033/vinicius-junior',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
	 'x-mas': data[0]["result_string"] }
});

	res.json(response.data)
	
}

catch (e){
	console.log(e)
}
})

module.exports = player


