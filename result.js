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
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; g_state={"i_p":1732733726602,"i_l":4}; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1731788145.4.0.1731788152.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1731788144.5.0.1731788152.0.0.0; _hjSessionUser_2585474=eyJpZCI6IjI2MzYwODdjLWQ5NzQtNWI2Yi05ZmZjLWJiN2FkMjE4YzgwNyIsImNyZWF0ZWQiOjE3MzI1NDcyODA4NTQsImV4aXN0aW5nIjp0cnVlfQ==; cto_bundle=8-qd7F9mVkRhV0FVeUZBaFVXd3Npcm5KWkxTNiUyRmR5NDdQdG55WmdhNThXaVEyRnMzcyUyRjhtekdlSGFWcDFQME1LdUtQeDlyaEV5JTJGZTJPRHRmcnZIUUFmekZvbkFNVE5RenNVbXo3N0hSeEJiSlVsclVJa2tIJTJCc0dTa0xVMlVUM3ZFQmpBc0hTSlFDaWVDNFhHV2kyTHZhNDd1dyUzRCUzRA; panoramaId_expiry=1732964818677; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.19%22%7D; _hjSession_2585474=eyJpZCI6IjA5Y2UxNGRlLTk4ODItNGRjYi04OWRmLTUwZDMzMWY2MDg1YiIsImMiOjE3MzI5MjA2ODkzNTcsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; _ga_G0V1WDW9B2=GS1.1.1732920684.71.1.1732920696.0.0.0; __gads=ID=92d5d724039964be:T=1718667552:RT=1732920697:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1732920697:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1732920697:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; FCNEC=%5B%5B%22AKsRol8B6DkFNxIhK6bkjso5ZyaqUPz6YD_1cBqeV1zUdRgUIIBj4cn5NlCIcgLhI6I_EyA8uJAMeChUhN9dBvYdDXy7up5KgCowphP4f-avnjBu5ST_w-9WUrTaRfD66zpU708pZRMkpaRbzrZy0cw3Q5s6v0EvRA%3D%3D%22%5D%5D',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/southampton-vs-brighton/2vrwh7',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas': 'eyJib2R5Ijp7InVybCI6Ii9hcGkvbHRjP2x0Y1VybD1kYXRhLmZvdG1vYi5jb20lMkZ3ZWJjbCUyRmx0YyUyRmdzbSUyRjQ1MDY0MTFfZW4uanNvbi5neiZ0ZWFtcz0lNUIlMjJCcmlnaHRvbislMjYrSG92ZStBbGJpb24lMjIlMkMlMjJTb3V0aGFtcHRvbiUyMiU1RCIsImNvZGUiOjE3MzI5MjA3MDM0MDMsImZvbyI6ImU5NzNmYzczZiJ9LCJzaWduYXR1cmUiOiI2RkQzNjM0REI0NEM2ODlFOERDOTAxNUI4Njc4RTJGMSJ9'
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