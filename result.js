const express = require("express")
const axios = require("axios")
const { model_schema } = require("./auth.js");

const result = express.Router()




result.get("/strong", async (req, res)=>{
  try{
     const data = await model_schema.find()
const id = req.query.id
  const response = await axios.get('https://www.fotmob.com/api/matchDetails', {
  params: {
    'matchId': '4535423'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; cto_bundle=Aus-bl9mVkRhV0FVeUZBaFVXd3Npcm5KWkxXbXAzRkpjSVQzeUM2eUc2Tzc0NjhaNzR5alNZSGxJWlozQlRQWUlTT3glMkJudTkzY2lJSU9xUkdPbElETHUzJTJGQ0E1Y2FFNVR5a2VkalZrQmVkZENGQktlYjF0Rm53Z01qY0ZnZmc3RFFkMlVOVnI4dnphd1lKTjJuN05uY0NyQ0JRJTNEJTNE; g_state={"i_p":1732733726602,"i_l":4}; FCNEC=%5B%5B%22AKsRol8UUofQKonYpaGcHLe5cJaczp5g4pzKBzGCd9eViWH5bdF0EsIiJ_9piDUhjZGwHUsr_KFQCoqPnZi596QILT-iKneJXrHlxqBgkGB93_MGIJgTo_BZUWH3BQzio3RZM1UZp_p2nDQIgAskpNWGtnhdKIUVGw%3D%3D%22%5D%5D; __gads=ID=92d5d724039964be:T=1718667552:RT=1730315247:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730315247:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730315247:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _ga_G0V1WDW9B2=GS1.1.1730314499.37.1.1730315249.0.0.0; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0',
    'if-none-match': '"cq1wpn8sk34w66"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/empoli-vs-inter/2frraf',
     'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'If-Modified-Since': '0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas':  data[0]["result_string"]
  }
});

  res.json(response.data)
}

catch (e){
  console.log(e)
}
})
    


result.get("/result", async(req, res)=>{

	try{
       const data = await model_schema.find()

	const id = req.query.id
	console.log(id)
	  const response = await axios.get('https://www.fotmob.com/api/matchDetails', {
  params: {
    'matchId': id.id
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; cto_bundle=Aus-bl9mVkRhV0FVeUZBaFVXd3Npcm5KWkxXbXAzRkpjSVQzeUM2eUc2Tzc0NjhaNzR5alNZSGxJWlozQlRQWUlTT3glMkJudTkzY2lJSU9xUkdPbElETHUzJTJGQ0E1Y2FFNVR5a2VkalZrQmVkZENGQktlYjF0Rm53Z01qY0ZnZmc3RFFkMlVOVnI4dnphd1lKTjJuN05uY0NyQ0JRJTNEJTNE; g_state={"i_p":1732733726602,"i_l":4}; FCNEC=%5B%5B%22AKsRol8UUofQKonYpaGcHLe5cJaczp5g4pzKBzGCd9eViWH5bdF0EsIiJ_9piDUhjZGwHUsr_KFQCoqPnZi596QILT-iKneJXrHlxqBgkGB93_MGIJgTo_BZUWH3BQzio3RZM1UZp_p2nDQIgAskpNWGtnhdKIUVGw%3D%3D%22%5D%5D; __gads=ID=92d5d724039964be:T=1718667552:RT=1730315247:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730315247:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730315247:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _ga_G0V1WDW9B2=GS1.1.1730314499.37.1.1730315249.0.0.0; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0',
    'if-none-match': '"cq1wpn8sk34w66"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/empoli-vs-inter/2frraf',
     'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'If-Modified-Since': '0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': data[0]["result_string"]
  }
});

  res.json(response.data)
}

catch (e){
	
}
})

result.get("/commentary", async(req, res)=>{
  try{
             const datad = await model_schema.find()
          const data = req.query

          const teams =  data.first

          const stringy = JSON.stringify(data.first)
          const main = "'"+stringy+ "'"
          var inc 

          if(data.arr.includes("en")){
            inc = "en"
          }

          else if(data.arr.includes("en_gen")){
            inc = "en_gen"
          }

          else{
            inc = data.arr[1]
          }
         
        console.log(inc)

        console.log(stringy)

        

const response = await axios.get('https://www.fotmob.com/api/ltc', {
  params: {
    'ltcUrl': "data.fotmob.com/webcl/ltc/gsm/"+data.id+"_"+inc+".json.gz",
       'teams': stringy 
  },
headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=c8c6179c3962460a30e12119dd8cf3ee; fbuser=%7B%22displayName%22%3A%22Edward%20S.%20Yambasu%22%2C%22name%22%3A%22Edward%20S.%20Yambasu%22%2C%22image%22%3A%22https%3A%2F%2Fplatform-lookaside.fbsbx.com%2Fplatform%2Fprofilepic%2F%3Fasid%3D474237165603592%26height%3D50%26width%3D50%26ext%3D1728350892%26hash%3DAbYTvrYFwoySp8zxRDmG5FLh%22%2C%22id%22%3A%22474237165603592%22%7D; g_state={"i_p":1734988355968,"i_l":4}; _gid=GA1.2.884326258.1732569171; _hjSessionUser_2585474=eyJpZCI6IjRkYzlhZGJjLTQ2YTUtNTczMS05Y2Y0LTkxZGQxZWQ1ODAyNCIsImNyZWF0ZWQiOjE3MzI1NjkxNDM1NjksImV4aXN0aW5nIjp0cnVlfQ==; __gads=ID=9828ff5d7c2cd946:T=1720874168:RT=1732652806:S=ALNI_MaUS8lEc4ApqGrphdQQTv9ETkycaA; __gpi=UID=00000e8802ba87fb:T=1720874168:RT=1732652806:S=ALNI_MY5cN5RUAsgtbUfTaQYRYSs8mclVw; __eoi=ID=c8bcf496f47c802e:T=1720874168:RT=1732652806:S=AA-AfjbMK25OSSPf8IUC9Liswzlb; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.138%22%7D; cto_bundle=cV1sFF9adWNZMzk1c1lPamUyNHN4Y21xb2x1WEJTNCUyQkhyTVU5SGpQTmFkVSUyRjRBREVCU0Z4Q3pYT0ZDcTRBSG5RbU81MjE2MVlkbzBRM1VLbURtdnBxRUQzRHRLdkt1Rk04ZzJIbFBTZmNscTYwWjlhS0ZpUzlrY1V6c2o1TVpYQ1JuT2lDSSUyQlV3RFY4M1NXVDNTWWZOVmNBZ0kxSCUyQmlCSmlZRHFteUIlMkYzT0Q1NHlXdjdxbzRGJTJGbjhwV1dNVU9WTyUyQldDeVR6eExMUkhwS240NndMZGFaWE9ucEdqWlg4TWFIQ2F0JTJGWXpSblhWNU9ySmNvUmNkenk5RklxYWRHd2RSQyUyRjNTWlF0N2swbGhpb3ZvYyUyRjVDTVdFTW1xMSUyRnUlMkY1N1pNME10cGwlMkZYNDVkSHZrdFIwUXBueENsTnY1RGttMFNLNjM2; _ga=GA1.1.1197639636.1720874154; _ga_SQ24F7Q7YW=GS1.1.1732652960.13.1.1732653008.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1732652957.13.1.1732653008.0.0.0; FCNEC=%5B%5B%22AKsRol-Tb7trbeDVsZAHBBnmZgweFqkpOWpv0oEhlI16emmJ9p28X8rEOCYMxIbosuAwjXHfL3NxHfH4v1pTqa_WrmJk76n0rDIt0M6Xmqp3c0Rzb0ns_oo4kFzOYH-tk9JCn0acj8gzuz5LfK-ZrMAIfekCgS2dqg%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1732652805.76.1.1732653051.0.0.0',
    'if-none-match': '"ok3ov9mj6qaga"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/brest-vs-barcelona/2fm8n4',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'x-mas': data[0]["comm"]
  }
});


            res.json(response.data)
            console.log(response.data)
            

  }

  catch(e){
    console.log(e)
  }
})


module.exports = result