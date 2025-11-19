const express = require("express")
const axios = require("axios")
const { model_schema, generateMatchesToken, generateXmasToken } = require("./auth.js");
const matches = express.Router()

matches.get("/man", async(req, res)=>{

  try {
    const data = await model_schema.find()
    
    // Fallback: if no token in DB, generate one
    let token = data[0]?.["variable"];
    if (!token) {
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      token = generateMatchesToken(date, 'Africa%2FMonrovia', 'LBR');
    }
    
    console.log("Using token:", token)
    
    const response = await axios.get('https://www.fotmob.com/api/matches', {
  params: {
    'date': '20241030',
    'timezone': 'Africa/Monrovia',
    'ccode3': 'LBR'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; cto_bundle=Aus-bl9mVkRhV0FVeUZBaFVXd3Npcm5KWkxXbXAzRkpjSVQzeUM2eUc2Tzc0NjhaNzR5alNZSGxJWlozQlRQWUlTT3glMkJudTkzY2lJSU9xUkdPbElETHUzJTJGQ0E1Y2FFNVR5a2VkalZrQmVkZENGQktlYjF0Rm53Z01qY0ZnZmc3RFFkMlVOVnI4dnphd1lKTjJuN05uY0NyQ0JRJTNEJTNE; g_state={"i_p":1732733726602,"i_l":4}; FCNEC=%5B%5B%22AKsRol8UUofQKonYpaGcHLe5cJaczp5g4pzKBzGCd9eViWH5bdF0EsIiJ_9piDUhjZGwHUsr_KFQCoqPnZi596QILT-iKneJXrHlxqBgkGB93_MGIJgTo_BZUWH3BQzio3RZM1UZp_p2nDQIgAskpNWGtnhdKIUVGw%3D%3D%22%5D%5D; __gads=ID=92d5d724039964be:T=1718667552:RT=1730315247:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730315247:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730315247:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; _ga_G0V1WDW9B2=GS1.1.1730328700.38.0.1730328702.0.0.0',
    'if-none-match': '"9v4fzqs7gx30vp"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': token
  }
});

  res.json(response.data)
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
})

matches.get("/audio_matches", async (req, res)=>{
  try {
    // Generate token for audio-matches endpoint
    const token = generateXmasToken('/api/audio-matches');

    const response = await axios.get('https://www.fotmob.com/api/audio-matches', {
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; g_state={"i_p":1732733726602,"i_l":4}; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1731788145.4.0.1731788152.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1731788144.5.0.1731788152.0.0.0; _hjSessionUser_2585474=eyJpZCI6IjI2MzYwODdjLWQ5NzQtNWI2Yi05ZmZjLWJiN2FkMjE4YzgwNyIsImNyZWF0ZWQiOjE3MzI1NDcyODA4NTQsImV4aXN0aW5nIjp0cnVlfQ==; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.191.107.55%22%2C%22regionId%22%3A%22MO%22%2C%22regionName%22%3A%22Montserrado%20County%22%7D; panoramaId_expiry=1733051971690; FCNEC=%5B%5B%22AKsRol_G8ZfR37BYKlxRlb2EgwZ9K6FQHhwL7lNYfpEc028oMXDD9lnhtcyTAH5_-sbL7LVdcsKVySGexFRW6bWewTUl5iC1mOIP9a8XdIb3sGirRDuKI4NdORK8fJLArVSGyN0cbQzQa-n7CPyverHy_ATRzzv0ow%3D%3D%22%5D%5D; cto_bundle=864bBV9mVkRhV0FVeUZBaFVXd3Npcm5KWkxiclYlMkJZb3Q3blJDOTRlVmRGZEF3OTlhaXV0VzdOcGRmN2RXd1FJNFo2OWFOd20yVmVjSzJyZ3NyY0lISWlTcnElMkJybUlwc3NZQ2hWR3BHWXJYQ0dlNGF1SVUwRXQzUUdRN3NOM0U0NVlYNFUxMUdCM0FPOGp5UXp1Q01NT09vM1RBJTNEJTNE; __gads=ID=92d5d724039964be:T=1718667552:RT=1732965919:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1732965919:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1732965919:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _hjSession_2585474=eyJpZCI6IjQ1YzlhYzQwLTI0ZGMtNDNjOC05MTMzLWU4ZWZmZWRhM2I4ZSIsImMiOjE3MzI5NjkyNzQ1NjcsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _ga_G0V1WDW9B2=GS1.1.1732969275.74.0.1732969275.0.0.0',
    'if-none-match': '"d6fjvfkh5t7a"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/131.0.0.0',
    'x-mas': token
  }
});

  res.json(response.data)
  } catch (error) {
    console.error('Error fetching audio matches:', error);
    res.status(500).json({ error: 'Failed to fetch audio matches' });
  }
})

matches.get("/match", async(req, res)=>{
  try {
    const data = await model_schema.find()
    const {date, timeZone, code} = req.query

    console.log(req.query)

    // Generate token with query parameters or use cached token
    let token = data[0]?.["variable"];
    if (!token || date) {
      // Generate fresh token if date is provided
      const encodedTimezone = timeZone ? encodeURIComponent(timeZone) : 'Africa%2FMonrovia';
      token = generateMatchesToken(date, encodedTimezone, code || 'LBR');
    }

    const response = await axios.get('https://www.fotmob.com/api/matches', {
  params: {
    'date': date,
    'timezone': timeZone,
    'ccode3': code
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; cto_bundle=Aus-bl9mVkRhV0FVeUZBaFVXd3Npcm5KWkxXbXAzRkpjSVQzeUM2eUc2Tzc0NjhaNzR5alNZSGxJWlozQlRQWUlTT3glMkJudTkzY2lJSU9xUkdPbElETHUzJTJGQ0E1Y2FFNVR5a2VkalZrQmVkZENGQktlYjF0Rm53Z01qY0ZnZmc3RFFkMlVOVnI4dnphd1lKTjJuN05uY0NyQ0JRJTNEJTNE; g_state={"i_p":1732733726602,"i_l":4}; FCNEC=%5B%5B%22AKsRol8UUofQKonYpaGcHLe5cJaczp5g4pzKBzGCd9eViWH5bdF0EsIiJ_9piDUhjZGwHUsr_KFQCoqPnZi596QILT-iKneJXrHlxqBgkGB93_MGIJgTo_BZUWH3BQzio3RZM1UZp_p2nDQIgAskpNWGtnhdKIUVGw%3D%3D%22%5D%5D; __gads=ID=92d5d724039964be:T=1718667552:RT=1730315247:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730315247:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730315247:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; _ga_G0V1WDW9B2=GS1.1.1730328700.38.0.1730328702.0.0.0',
    'if-none-match': '"9v4fzqs7gx30vp"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/',
    'sec-fetch-dest': 'empty',
     'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'If-Modified-Since': '0',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': token
  }
});

    res.json(response.data)
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
})



matches.get("/all_leagues",async (req, res)=>{
  try {
    const data = await model_schema.find()
    
    // Generate token or use cached
    let token = data[0]?.["variable"];
    if (!token) {
      token = generateXmasToken('/api/allLeagues?locale=en&country=INT');
    }

    const response = await axios.get('https://www.fotmob.com/api/allLeagues', {
  params: {
    'locale': 'en',
    'country': 'INT'
  },
  headers: {
    'x-mas': token,
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'Referer': 'https://www.fotmob.com/'
  }
});

    res.json(response.data)
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
})



matches.get('/proxy', async (req, res) => {
  const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: {
        url,
        w,
        q,
      },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer', // If you need to get binary data (like an image)
    });
    res.set('Content-Type', response.headers['content-type']);
  
    res.send(response.data);

  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

matches.get('/roxy', async (req, res) => {
  const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: {
        url,
        w,
        q,
      },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer', // If you need to get binary data (like an image)
    });
    res.set('Content-Type', response.headers['content-type']);
  
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

matches.get('/player_pic', async (req, res) => {

 const { url, w, q } = req.query;
  try {
    const response = await axios.get('https://www.fotmob.com/_next/image', {
      params: {
        url,
        w,
        q,
      },
      headers: {
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
        'Referer': 'https://www.fotmob.com/',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
        'sec-ch-ua-platform': '"Windows"',
      },
      responseType: 'arraybuffer', // If you need to get binary data (like an image)
    });
    res.set('Content-Type', response.headers['content-type']);
  
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }


});




module.exports = matches