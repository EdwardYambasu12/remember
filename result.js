const express = require("express")
const axios = require("axios")
const { model_schema, generateMatchDetailsToken } = require("./auth.js");

const result = express.Router()




result.get("/strong", async (req, res)=>{
  try{
    const data = await model_schema.find()
    const id = req.query.id
    
    // Generate token for this specific match or use cached
    let token = data[0]?.["result_string"];
    if (!token) {
      token = generateMatchDetailsToken('4535423');
    }
    
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
    'x-mas': token
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

    // Generate token for this specific match ID
    let token = data[0]?.["result_string"];
    if (!token || id?.id) {
      token = generateMatchDetailsToken(id?.id || '4822533');
    }

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
    'x-mas': token
  }
});

  res.json(response.data)
}

catch (e){
	
}
})


result.get("/match_odds", async(req, res)=>{

       const data = await model_schema.find()


  const response = await axios.get('https://www.fotmob.com/api/matchOdds', {
  params: {
    'matchId': req.query.id.id,
    'ccode3': 'INT'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; _hjSessionUser_2585474=eyJpZCI6IjI2MzYwODdjLWQ5NzQtNWI2Yi05ZmZjLWJiN2FkMjE4YzgwNyIsImNyZWF0ZWQiOjE3MzI1NDcyODA4NTQsImV4aXN0aW5nIjp0cnVlfQ==; g_state={"i_p":1736286556611,"i_l":4}; _ga_SQ24F7Q7YW=GS1.1.1734878543.8.0.1734878547.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1734878538.9.1.1734878977.0.0.0; _ga=GA1.1.2119553545.1718667549; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.191.105.235%22%2C%22regionId%22%3A%22MO%22%2C%22regionName%22%3A%22Montserrado%20County%22%7D; _hjSession_2585474=eyJpZCI6ImMyNGM0MzVkLWU5MWQtNDQyNy1hNTJjLWZiN2YyMzM5ZjJmNyIsImMiOjE3MzU5OTI5MTIzMDAsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; __gads=ID=92d5d724039964be:T=1718667552:RT=1735992914:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1735992914:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=0dd2145e8d3f3c53:T=1734298662:RT=1735992914:S=AA-AfjZ0P-59YSEi2rEQUgujHVi-; panoramaId_expiry=1736079316903; panoramaId=3898e4eff149868f9adc1fb98479a9fb927a8f07a7791faa1de8aec5ee287b78; panoramaIdType=panoDevice; cto_bundle=oqla9F9mVkRhV0FVeUZBaFVXd3Npcm5KWkxTQjdrekR5dWRRWlg3ViUyRmh5cGQ1QmlZWXFTWHFxVTZsY1clMkZvZVJhWnRXTThibUpVWDRzdiUyRkN4SU5UcndKWUx3Q2NUeXQ4NUJOVXVMc0RydEc1WG53c0c2MEFKdk0wZFRlakpRNlIxMTRxdklnVGs3blklMkJyMVlsTWluNyUyQiUyQnMxM2clM0QlM0Q; FCNEC=%5B%5B%22AKsRol-XeM02tsiBsbfx85jne3ubInIo3Zj3EHDgg8vM9TXzP-N8FM6qOFMezz09x0SxkbeFalUjjjLZjOwvxJVdDAHS_uB1rp1r9xCSsAMXCEjhLNi2iA6g1clBL1tvKF4yK_6NCHyWfbzfqPbLyZH1bzl3kzIcZg%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1735992913.96.1.1735992988.0.0.0',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/tottenham-vs-newcastle/2xr2ka',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas': data[0]["odds"],
  }
});


res.json(response.data)
})
result.get("/match_news",  async(req, res)=>{

  const data = await model_schema.find()

  const response = await axios.get('https://www.fotmob.com/api/matchNews', {
  params: {
    'id': req.query.id,
    'ccode3': 'LBR',
    'lang': 'en'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; _hjSessionUser_2585474=eyJpZCI6IjI2MzYwODdjLWQ5NzQtNWI2Yi05ZmZjLWJiN2FkMjE4YzgwNyIsImNyZWF0ZWQiOjE3MzI1NDcyODA4NTQsImV4aXN0aW5nIjp0cnVlfQ==; g_state={"i_p":1736286556611,"i_l":4}; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1736535147.9.0.1736535167.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1736535145.10.0.1736535167.0.0.0; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.247%22%7D; _hjSession_2585474=eyJpZCI6IjE3OWQxZmYwLTIxNTEtNGJkZC04NzAyLWM4OWM4NDQxMjRlNiIsImMiOjE3MzY2MjQ5ODU3NTQsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; __gads=ID=92d5d724039964be:T=1718667552:RT=1736624995:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1736624995:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=0dd2145e8d3f3c53:T=1734298662:RT=1736624995:S=AA-AfjZ0P-59YSEi2rEQUgujHVi-; panoramaId_expiry=1736711397536; cto_bundle=MyibLF9mVkRhV0FVeUZBaFVXd3Npcm5KWkxkQ0M4ak0lMkZiZzBCdTJyVlh2bmdkTEMzJTJGa0k3JTJCaW5JJTJGU2JoVWpQcmZlZjBmSmJNTXZOMExOcENSbnBXUzlJVncxRDVyMmRHUkJ3bkdRaVFlOHVxZHdQQ2dmV2dnT1pNZ0FOJTJCVU1zYjdZOXdaUGklMkZmNXd0JTJGbXdITUtmdk5XSEdJQSUzRCUzRA; FCNEC=%5B%5B%22AKsRol99cACRpS7uLflu1hMAcInPZCYVUAnVy7EAeLmUUXB-ZdsBKhsyCLPUfO02xaPjDrSQx64R8uabzgjVa26sy5frvdHfUJfH-zV7KPfCPTVewc_LtN-ZBErsUrBXJfX90eZuVj2lsSKCDYAYF_-jfV2UpLfYAA%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1736624986.105.1.1736625084.0.0.0',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/matches/girona-vs-deportivo-alaves/2k79ez',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas': data[0]["m_news"]
  }
});

  res.json(response.data)
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

    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas':  data[0]["comm"]
  }

});


            res.json(response.data)
            
            

  }

  catch(e){
    console.log(e)
  }
})

result.get("/audio_commentary", async(req, res)=>{

  const {id} = req.query




  const response = await axios.get('https://www.fotmob.com/api/audio-live-stream', {
  params: {
    'id': id,
    'acceptLangs': 'en-US',
    'userLang': 'en'
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas': 'eyJib2R5Ijp7InVybCI6Ii9hcGkvYXVkaW8tbGl2ZS1zdHJlYW0/aWQ9NDUwNjk0MSZhY2NlcHRMYW5ncz1lbi1VUyZ1c2VyTGFuZz1lbiIsImNvZGUiOjE3MzMyNTQxODUxOTgsImZvbyI6Ijg5MDUwMjBkNyJ9LCJzaWduYXR1cmUiOiIwMzY1OEFGQjAyN0NCNjU5RDREQzUzQkJBODlFMkQ0MiJ9',
    'Referer': 'https://www.fotmob.com/matches/las-palmas-vs-barcelona/2dfogo'
  }
});

  res.json(response.data)
})


module.exports = result