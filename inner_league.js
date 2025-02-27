const express = require("express")
const axios = require("axios")
const { model_schema } = require("./auth.js");

const league = express.Router()

league.get("/round", async(req, res)=>{
  const data = await model_schema.find()
    console.log(req.query)
  try{
const response = await axios.get('https://www.fotmob.com/api/team-of-the-week/rounds', {
  params: {
    'leagueId': req.query.id,
'season': req.query.season,
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'x-mas':  data[0]["result_string"],
    'Referer': 'https://www.fotmob.com/leagues/87/overview/laliga'
  }
});

res.json(response.data)
}
catch(e){
  console.log(e)
}
})



league.get("/totw", async(req, res)=>{

 try{

  console.log(req.query)
  const data = await model_schema.find()
   const response = await axios.get('https://www.fotmob.com/api/team-of-the-week/team', {
  params: {
    'leagueId': req.query.id,
    'roundId': req.query.round,
    'season': req.query.season,
    'isV4': 'true'
  },
  
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; g_state={"i_p":1732733726602,"i_l":4}; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; cto_bundle=2gXfoF9mVkRhV0FVeUZBaFVXd3Npcm5KWkxTQnZTeURkTDk0YU5zWjJCNW9WcGlCVWlSVjhjbnJmZkpmUE9UaE94RW8lMkZnb0k2VFZEMkk3VDg0ZTg3eXNZT1EyUVVZVlR2SUVQRFJXTXRHS3NRTE90VGdGSG5TRSUyRm1ialFXVTRpQ3VZNXBIUWR3NGVDbzdQbXJUR2R2SEEyYTB3JTNEJTNE; __gads=ID=92d5d724039964be:T=1718667552:RT=1730335783:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730335783:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730335783:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; FCNEC=%5B%5B%22AKsRol9d4NmfsyUiizdojNtG3h6-qQSEaduY2RQleTqhZre80W3PqahxQ6sO_PkJwUfJtfGoNn9AbJ1PI2T0vs2XXqTGP_dBSMGRHAVvKPoxXoLjCIqdb4hREGy5q4BartzBMZU0uOcdZET5g_jaQkpvfRV9qwOfvQ%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1730331795.39.1.1730336037.0.0.0',
    'if-none-match': '"yybhf3uwz02cz"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/leagues/55/overview/serie',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': data[0]["result_string"]
  }
});
      res.json(response.data)
    }

    catch(e){
      console.log(e)
    }
})



league.get("/league", async(req, res)=>{

	try{
    const data = await model_schema.find()
const response = await axios.get('https://www.fotmob.com/api/leagues', {
  params: {
    'id': req.query.id,
    'ccode3': 'LBR'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.10%22%7D; panoramaId_expiry=1730370048384; g_state={"i_p":1732733726602,"i_l":4}; _gid=GA1.2.1615250911.1730315259; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1730315282.3.0.1730315295.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1730315262.3.0.1730315295.0.0.0; cto_bundle=2gXfoF9mVkRhV0FVeUZBaFVXd3Npcm5KWkxTQnZTeURkTDk0YU5zWjJCNW9WcGlCVWlSVjhjbnJmZkpmUE9UaE94RW8lMkZnb0k2VFZEMkk3VDg0ZTg3eXNZT1EyUVVZVlR2SUVQRFJXTXRHS3NRTE90VGdGSG5TRSUyRm1ialFXVTRpQ3VZNXBIUWR3NGVDbzdQbXJUR2R2SEEyYTB3JTNEJTNE; FCNEC=%5B%5B%22AKsRol9srQ9HQHf6CDdWY5tcnLsNcKZmZxFPmyRdQfH-tRnLahPPDk8C8FlnpMD5I4mMFWP38k-DTho1X7nbB1-2Tv56MQW30sWzh3aZuStcixq17OTy8WHBEfYfAO1h9UsGfwzvfz4zxb0WNrzEbvK_SJ8y96PQkg%3D%3D%22%5D%5D; __gads=ID=92d5d724039964be:T=1718667552:RT=1730329871:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1730329871:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1730329871:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; _ga_G0V1WDW9B2=GS1.1.1730328700.38.1.1730329921.0.0.0',
    'if-none-match': '"k0yybq1miicsfh"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/leagues/55/overview/serie',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
        'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'If-Modified-Since': '0',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/130.0.0.0',
    'x-mas': data[0]["result_string"]
  }
});
	res.json(response.data)
}
catch(e){
	console.log(e)
}
})


league.get("/league_news", async(req, res)=>{

  try{
    const data = await model_schema.find()
  const response = await axios.get('https://www.fotmob.com/api/tlnews', {
  params: {
    'id': req.query.id,
    'type': 'league',
    'language': 'en',
    'startIndex': '0'
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=c8c6179c3962460a30e12119dd8cf3ee; g_state={"i_p":1728177707886,"i_l":4}; psession=wr0pDoFBqpxEeO_3PtBKxw.SL1dzPqDCxI1Jy7NA3xtGWNFmEIV9MUUQQ630G-auJY.1725758879931.2592000000.3Chzlf8p0ISQ0lp6e0V7vItW7eVpofXd8VLqm98eQRU; fbuser=%7B%22displayName%22%3A%22Edward%20S.%20Yambasu%22%2C%22name%22%3A%22Edward%20S.%20Yambasu%22%2C%22image%22%3A%22https%3A%2F%2Fplatform-lookaside.fbsbx.com%2Fplatform%2Fprofilepic%2F%3Fasid%3D474237165603592%26height%3D50%26width%3D50%26ext%3D1728350892%26hash%3DAbYTvrYFwoySp8zxRDmG5FLh%22%2C%22id%22%3A%22474237165603592%22%7D; user=wPnCBVh4ZrrQVKDphRpCpw.0qwZuMMXUr5GxyhXPT3MuAQm3ppe77ct1lFeCLzp-4tetoXqghtlhbFD31BUlpML3voNVDQt6Z7RIQyplA4PrIja5Zr4nqUxCQnT7ZWKhwx388PLYcTCIqt4yLNNohGJV4IxVngOAnnqIk8TTn0yspbbr1HAh24aGnEeSIOb4uivB9AQUvw0XBS9_d9GLcSzMNgYT1uIpqn2-6iaqEjov3JP7Fy5rnUVMKnWv3tKMNqhXqnAyknthQILiI9f2mrBwgLH-TkQql8z5D41_dDC7vi5oYjU_u0roZdUd09wqBv8kw5zMxG0C2CxspOocAtB-tpJt_nkA6sc9qmIjfG0FMr9Ns11OzABoaAV5F_7mLJH0P447PEw1qIVE3iZ8xCF0EKtDzE7gAjWpOpZY4DyuHExIvRmpxWqjDzT5JkD_PXq2qTG25j8rNGcD0GUyvu6w_D6yfgpJwdQeU5-XupXN5VcoGuOzXFfJnBSrzxHOGHKZrGzHgEnovTcRxQir-n2emc1c4xey3yBlf7D0sDJI5tXcgJdDg2R99EtgZUy45nKuhgojI-KZhHxcF_WF2Ib9HfDuM5EnQbcvRoN-Fak2YU5P0aJ-wcaCoHApe_pcutxwXqe49BwIBjZT8_qALlAuTEgn_9lmu3-A6C_EOY6YesgMvXpLUO7YYW7uiOd1XfED7P2eVS6GHqVjeqobVnGCR2Ct4NYAxSskDgcPR6409g_IOH_deXe1G0__5yW8NqkbGn3J605zq6wXq80yi3ik5X4P1wHC4kp8N2zsec0gy8M18D3Exyi2CyyEKF1cuy-KHqjToiXbPd3WZ-9WmoKx5fauWo3jyj65S0JMiNT8ilRr_7dRpLMrZQ05xJuqYsg6L1rSDTlIDZcPApJ-3mYl63ccdHwkPaF-e7l4_St5NgVaAENf3GDueOiRouErVBSgZBLfiOomLUjJ3SAzPe0fv_tYzQzSPkosKDaz-a2hK4KwA7boTePmP1CPo69HkhLsjbz05c4Ruo20hu0ttPOqdQtE1vB0ideYUpnqsQEE9gDQu-ICLut_hSj00F1-Ly4HlZ8ESGu8A2YDQyqfvnRs5P8_I-lWwn7BwtTbvIjT3itw8QQOjpJnzfFD0FizG3q55eYqF4OpbKb8mRO6vjF649jUQHGk_uQti0RSzmtqDUUxS5P87Hr5Ezkfztc8vfJMCOUnt8B8mYT_lM_kUJDTXqJ8U_WKtmfhyJjWUresacGshENIfj-pQT9BU-gxbw1AVhrzQsyOFYqGkjYWBIPtmGzDRd79IGF_H0KJGNNgOKsN33LADG_t6a5YFE-FbRzXDvRRfBVXAjwhBYOA9vxkFW1g7l1HMShNj0b_aSAvBiXNT7ETiwgqjajVjNsfDJI-hISI6rtfgS-exMbvezgzRvwZJufmS9CMjeHbnp0VDfE9jDovZyrLJqdYwrm626ThF9HLe94ksYTQwdFhVAKwJEbT5HtG03v31pnsbCoU3W3fz5ibqbMAO9sexXt6GHuV0rklTXoLfV0xsWPT70asgBqChB8cWVkX9UKaEnLCy3B-R0WgnofUQN7dsaq752oNUws2hyYeOMyIJG5jrxXr9SaxjuDqz7ejd2uRe0oJLgzMKX_1uK_ZtHxmC_TjEWdTmABOlO1Twtor2_vqOziF0Hh1D1fupit8tUbUU_giXQQt55aUTsqyitn31QtkgRnrEBjMEUlBAStERTplgN3MEezmVq0C11hdjD8hmsoddFwgI9jlzWtV_ycRoHSN0VTgLZ5gjSCKykXkadzArvMmmfyY2Slsuya3OizYT9XmKOroYJiI4lTlZfT8wD6Hbw0OlmrAeS0ObazjTvu0X4DW6GnvkTejRnZmyTQB3d07DPRd0lUWQSrC6dQrvo0Hb31arKJCFhEHhojhxBqJFfznaRPxtE7r0zHHgXZIaZTzoVs1N_n3Jmk6NpsFpZgEclhSFSlK3Vhvyx54iywqsRL.1725758892291.2592000000.u6Jks7LtNJRyTCnvKd6n88O5juBf7D6ccMmGqkfwcbk; _ga=GA1.1.1197639636.1720874154; _ga_SQ24F7Q7YW=GS1.1.1725760073.11.1.1725760993.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1725760071.11.1.1725760993.0.0.0; panoramaId_expiry=1726094574143; panoramaId=e4b4fa1fd9fea19f22e53d95bf7ea9fb927a88d4231076be7156765551f0d5f4; panoramaIdType=panoDevice; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.226%22%7D; __gads=ID=9828ff5d7c2cd946:T=1720874168:RT=1726058032:S=ALNI_MaUS8lEc4ApqGrphdQQTv9ETkycaA; __gpi=UID=00000e8802ba87fb:T=1720874168:RT=1726058032:S=ALNI_MY5cN5RUAsgtbUfTaQYRYSs8mclVw; __eoi=ID=c8bcf496f47c802e:T=1720874168:RT=1726058032:S=AA-AfjbMK25OSSPf8IUC9Liswzlb; FCNEC=%5B%5B%22AKsRol-2OiHy4kD0Zy21CW9lLSw3xtCuPPiFt_8pzKJmhtMSi0Un-eiiNvZnNcwv2XjvmChjhRqT6AZJYf6ACkV-2giuprHlqgsEvfshOFD33YUebO9__L1vyUPUwvQ2aEDjrIOwrHIChN67g_o0P2JZmrqwgu44-Q%3D%3D%22%5D%5D; cto_bundle=P_hJQl9adWNZMzk1c1lPamUyNHN4Y21xb2xwRDdEa010MGx5Z1VYJTJGT2RTYyUyRkxZVWV4ODVIVVJoZzIyRVpGb29GM0phJTJGeXBJNTJkb0JvNmN3ZEpQdDUlMkJTZFkwUiUyRlhIeTBpTTNhVGNRZDV0QnJLZ0ZpWWRXQ3RpQ0FoV1FqVXF0Y285NzVUMFluJTJGRkIyOWxUV1puRHBVTXVXUDNIQWI0T3olMkZqWXo1VVZDMTRHNWZXck9CR2k1S3VIeE0wZ3FjeldHY2p2VVIwJTJCR0dwRGxwRTRMUlRZcDc1dCUyQmNHWkt6SjJuS21lcjkzWThEdDhINzNKR3BWQmpGYnQlMkJWdjFlU1U5M0t3RG4; _ga_G0V1WDW9B2=GS1.1.1726067824.47.0.1726067824.0.0.0',
    'if-none-match': '"wo3wu3runq84s"',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/leagues/47/overview/premier-league',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'x-mas': 'eyJib2R5Ijp7ImNvZGUiOjE3MjYwNjc4MjYzMDh9LCJzaWduYXR1cmUiOiI4RDhENjI2MDM0QUE5MDM3QTkyNTk3QTVCNzgzMDNCOSJ9'
  }
})
    res.json(response.data)
}

catch(e){
  console.log(e)
}
})









module.exports = league	