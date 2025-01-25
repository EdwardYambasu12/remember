const { register_model } = require("./auth.js");
const axios = require("axios");
const { model_schema } = require("./auth.js");
const admin = require('./firebaseAdmin'); // Adjust the path as necessary
let previousData = [];
let previousnews = [];

require('dotenv').config();
async  function send_news(title, link, img){

   const id = await register_model.find()

    id.map((item)=>{

async function doom(titlem, linkm, imgm) {
      const message = {
  notification: {
    title: titlem,  // Title of the notification
    body: titlem,  // Body content of the notification
  },
  webpush: {
    fcmOptions: {
      link: linkm  // The link the user will be redirected to when clicking the notification
    },
     notification: {
      icon: imgm, // Optional icon for the notification
      sound: "/sounds/example_sound.mp3", // Path to the custom notification sound
    },
  },
  token: item.phone_string,  // The FCM registration token of the device
};
 
    try {
        const response = await admin.messaging().send(message);
          } catch (error) {

    }


    // body...
}

doom(title, link, img)




    })




}



async function news_fetch(){
   
        const response = await axios.get('https://www.fotmob.com/api/worldnews', {
  params: {
    'lang': 'en',
    'page': 1
  },
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '_cc_id=c8c6179c3962460a30e12119dd8cf3ee; g_state={"i_p":1728177707886,"i_l":4}; psession=wr0pDoFBqpxEeO_3PtBKxw.SL1dzPqDCxI1Jy7NA3xtGWNFmEIV9MUUQQ630G-auJY.1725758879931.2592000000.3Chzlf8p0ISQ0lp6e0V7vItW7eVpofXd8VLqm98eQRU; fbuser=%7B%22displayName%22%3A%22Edward%20S.%20Yambasu%22%2C%22name%22%3A%22Edward%20S.%20Yambasu%22%2C%22image%22%3A%22https%3A%2F%2Fplatform-lookaside.fbsbx.com%2Fplatform%2Fprofilepic%2F%3Fasid%3D474237165603592%26height%3D50%26width%3D50%26ext%3D1728350892%26hash%3DAbYTvrYFwoySp8zxRDmG5FLh%22%2C%22id%22%3A%22474237165603592%22%7D; user=wPnCBVh4ZrrQVKDphRpCpw.0qwZuMMXUr5GxyhXPT3MuAQm3ppe77ct1lFeCLzp-4tetoXqghtlhbFD31BUlpML3voNVDQt6Z7RIQyplA4PrIja5Zr4nqUxCQnT7ZWKhwx388PLYcTCIqt4yLNNohGJV4IxVngOAnnqIk8TTn0yspbbr1HAh24aGnEeSIOb4uivB9AQUvw0XBS9_d9GLcSzMNgYT1uIpqn2-6iaqEjov3JP7Fy5rnUVMKnWv3tKMNqhXqnAyknthQILiI9f2mrBwgLH-TkQql8z5D41_dDC7vi5oYjU_u0roZdUd09wqBv8kw5zMxG0C2CxspOocAtB-tpJt_nkA6sc9qmIjfG0FMr9Ns11OzABoaAV5F_7mLJH0P447PEw1qIVE3iZ8xCF0EKtDzE7gAjWpOpZY4DyuHExIvRmpxWqjDzT5JkD_PXq2qTG25j8rNGcD0GUyvu6w_D6yfgpJwdQeU5-XupXN5VcoGuOzXFfJnBSrzxHOGHKZrGzHgEnovTcRxQir-n2emc1c4xey3yBlf7D0sDJI5tXcgJdDg2R99EtgZUy45nKuhgojI-KZhHxcF_WF2Ib9HfDuM5EnQbcvRoN-Fak2YU5P0aJ-wcaCoHApe_pcutxwXqe49BwIBjZT8_qALlAuTEgn_9lmu3-A6C_EOY6YesgMvXpLUO7YYW7uiOd1XfED7P2eVS6GHqVjeqobVnGCR2Ct4NYAxSskDgcPR6409g_IOH_deXe1G0__5yW8NqkbGn3J605zq6wXq80yi3ik5X4P1wHC4kp8N2zsec0gy8M18D3Exyi2CyyEKF1cuy-KHqjToiXbPd3WZ-9WmoKx5fauWo3jyj65S0JMiNT8ilRr_7dRpLMrZQ05xJuqYsg6L1rSDTlIDZcPApJ-3mYl63ccdHwkPaF-e7l4_St5NgVaAENf3GDueOiRouErVBSgZBLfiOomLUjJ3SAzPe0fv_tYzQzSPkosKDaz-a2hK4KwA7boTePmP1CPo69HkhLsjbz05c4Ruo20hu0ttPOqdQtE1vB0ideYUpnqsQEE9gDQu-ICLut_hSj00F1-Ly4HlZ8ESGu8A2YDQyqfvnRs5P8_I-lWwn7BwtTbvIjT3itw8QQOjpJnzfFD0FizG3q55eYqF4OpbKb8mRO6vjF649jUQHGk_uQti0RSzmtqDUUxS5P87Hr5Ezkfztc8vfJMCOUnt8B8mYT_lM_kUJDTXqJ8U_WKtmfhyJjWUresacGshENIfj-pQT9BU-gxbw1AVhrzQsyOFYqGkjYWBIPtmGzDRd79IGF_H0KJGNNgOKsN33LADG_t6a5YFE-FbRzXDvRRfBVXAjwhBYOA9vxkFW1g7l1HMShNj0b_aSAvBiXNT7ETiwgqjajVjNsfDJI-hISI6rtfgS-exMbvezgzRvwZJufmS9CMjeHbnp0VDfE9jDovZyrLJqdYwrm626ThF9HLe94ksYTQwdFhVAKwJEbT5HtG03v31pnsbCoU3W3fz5ibqbMAO9sexXt6GHuV0rklTXoLfV0xsWPT70asgBqChB8cWVkX9UKaEnLCy3B-R0WgnofUQN7dsaq752oNUws2hyYeOMyIJG5jrxXr9SaxjuDqz7ejd2uRe0oJLgzMKX_1uK_ZtHxmC_TjEWdTmABOlO1Twtor2_vqOziF0Hh1D1fupit8tUbUU_giXQQt55aUTsqyitn31QtkgRnrEBjMEUlBAStERTplgN3MEezmVq0C11hdjD8hmsoddFwgI9jlzWtV_ycRoHSN0VTgLZ5gjSCKykXkadzArvMmmfyY2Slsuya3OizYT9XmKOroYJiI4lTlZfT8wD6Hbw0OlmrAeS0ObazjTvu0X4DW6GnvkTejRnZmyTQB3d07DPRd0lUWQSrC6dQrvo0Hb31arKJCFhEHhojhxBqJFfznaRPxtE7r0zHHgXZIaZTzoVs1N_n3Jmk6NpsFpZgEclhSFSlK3Vhvyx54iywqsRL.1725758892291.2592000000.u6Jks7LtNJRyTCnvKd6n88O5juBf7D6ccMmGqkfwcbk; _ga=GA1.1.1197639636.1720874154; _ga_SQ24F7Q7YW=GS1.1.1725760073.11.1.1725760993.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1725760071.11.1.1725760993.0.0.0; panoramaId_expiry=1725913126515; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.107%22%7D; __gads=ID=9828ff5d7c2cd946:T=1720874168:RT=1725904107:S=ALNI_MaUS8lEc4ApqGrphdQQTv9ETkycaA; __gpi=UID=00000e8802ba87fb:T=1720874168:RT=1725904107:S=ALNI_MY5cN5RUAsgtbUfTaQYRYSs8mclVw; __eoi=ID=c8bcf496f47c802e:T=1720874168:RT=1725904107:S=AA-AfjbMK25OSSPf8IUC9Liswzlb; cto_bundle=vHYP9V9adWNZMzk1c1lPamUyNHN4Y21xb2xyWGwlMkZTZGZHTm9FdjA0cyUyQlZNSzhYc2w3bUhmJTJCZDBRSVpyJTJCRjFoamZUT3VPazVQcTdQZGxmTU4lMkJjeVIyRmFWUFY0OExFNkptdCUyRmx0ZWR3RDczYWdUbGtjelVIRzI3MFZXeG54Z3glMkZFaTRwTWR6TCUyRnVENEZtOFVuRlNqYmt2RnV0anBFMVgxcDBkMkl4MzJZU05uMkMlMkJnMXFCdzlTZmJGS0I1ZWl0bVUlMkYzQW1kUVM4bnhjMHNFT1J2RWUyS3lXVGV6U25jRVYyb0dBJTJCZ0FaJTJGVFRUTkd1VCUyRmh2aGxJZ0dEazc5b201cDlJQWk; FCNEC=%5B%5B%22AKsRol_truuMllFKvGpxmvV6dmXJINJvNhGQlHooCSy8ga6yYoCHjQYJqdH-xBXoUKRFjatzcUildWDe2UU7MiH68cX0CVU9EX-_XV0LMomvUCtnNscI-Nx_ZJfurJtdWjtWcF_XKP2ZAvD6q__dzuhYQE4OibmEVA%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1725904098.39.1.1725906176.0.0.0',
    'priority': 'u=1, i',
    'referer': 'https://www.fotmob.com/news?page=3',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'x-fm-req': 'eyJib2R5Ijp7ImNvZGUiOjE3MjU5MDcwODk3Nzd9LCJzaWduYXR1cmUiOiIwMzQxNzQzOTg3QUI1NDJCQzE3MjExODY0RTcwMjg4QSJ9'
  }
});

return response.data.slice(0, 3)


}

async function news_change(latestNews, oldNews) {
    var filterer = []
const difference = latestNews.filter(item1 => 
  !oldNews.some(item2 => item2.id === item1.id)
);





return difference
}



async function publishPhotoPost( message, photoUrl) {

  try {
        const data = await model_schema.find()
      
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${data[0]["id"]}/photos`,
      {
        message: message,
        url: photoUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data[0]["token"]}`,
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("Error publishing photo post:", error.message);
    throw error;
  }
}

async function processNews(data){

     
        data.map((item)=>{
                var title 

                if(item.lead){
                    title = ` ${item.title}. \n ${item.lead} \n more news👉 www.sportsupd.com`
                }
                else{
                    title = ` ${item.title}. \n more news👉 www.sportsupd.com`
                }
              
               publishPhotoPost(title, item.imageUrl)
                send_news(title, item.page.url, item.imageUrl)
        })
}
async function fetchData() {
    try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const formattedDate = getFormattedDate();

        const newData = await fetchMatches(formattedDate);
        const changes = findChanges(previousData, newData);

       


        processChanges(changes);
       
        previousData = newData;  // Update previousData
       

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setTimeout(fetchData, 5000);  // Fetch data again after 10 seconds
    }
}



async function fetchDat() {
    try {
       

        const news_data_new = await news_fetch()
        const news_data_change = await news_change(news_data_new, previousnews)


        processNews(news_data_change)
   
        previousnews = news_data_new

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setTimeout(fetchDat, 180000);  // Fetch data again after 10 seconds
    }
}
fetchDat()
function getFormattedDate() {
    const date = new Date();
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

async function fetchMatches(date) {

  const data = await model_schema.find()
      
   const res = await axios.get('https://www.fotmob.com/api/matches', {
  params: {
    'date': date,
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
    'x-mas': data[0]["variable"]
  }
});

    return res.data.leagues.flatMap(league => league.matches);
}
 
async function findChanges(previousData, newData) {
    // Ensure changes is an array
 const changes = [];
    for (const newItem of newData) {
        const foundInPrevious = previousData.find(item => item.id === newItem.id);
        
        if (!foundInPrevious) {
            changes.push({ type: 'start', match: JSON.stringify(newItem) }); // New match started
        } else {
            if (newItem.status.finished && !foundInPrevious.status.finished) {
                send_notification({ type: 'end', match : JSON.stringify(newItem)  }); // Match ended
            }

            if (newItem.home.score !== foundInPrevious.home.score) {
                send_notification({ type: 'goal', match : JSON.stringify(newItem) , team: newItem.home.name });
            }

            if (newItem.away.score !== foundInPrevious.away.score) {
                send_notification({ type: 'goal', match : JSON.stringify(newItem) , team: newItem.away.name });
            }

                if(newItem.status.liveTime){
            if(newItem.status.liveTime.short == "HT" && foundInPrevious.status.liveTime.short != "HT"){
                send_notification({ type: 'HalfTime', match : JSON.stringify(newItem) , team: newItem.away.name });
            }
            if(newItem.status.liveTime.short == "1" ){
                send_notification({ type: 'start', match: JSON.stringify(newItem) })
            }
}
        }
    }

    return changes; // Always return an array
}

function processChanges(changes) {
    if (!Array.isArray(changes)) {
        console.error('Expected changes to be an array, but got:', changes);
        return;
    }

    changes.forEach(change => {
        switch (change.type) {
            case 'start':
                send_notification(`Match Started: ${change.home.name} vs ${change.away.name}`);
                break;
            case 'end':
                send_notification(`Match Ended: ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}`);
                break;
            case 'goal':
                send_notification(`Goal! ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}. Scorer: ${change.team}`);
                break;

            case 'HalfTime':
                send_notification(`HalfTime! ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}. Scorer: ${change.team}`);
                break;
        }
    });
}

async function send_notification(message) {

      const changed = JSON.parse(message.match)
    
                async function final_sender(token, title, body) {
   const message = {
  notification: {
    title: title,
    body: body,
  },
  token: token, // The FCM registration token of the device
  webpush: {
    fcm_options: {
      link: "https://sportsupd.com/result/" + changed.id, // The link to open when the notification is clicked
    },
    notification: {
      icon: "https://www.sportsupd.com/src/images/icon.jpg", // Optional icon for the notification
      sound: "/sounds/example_sound.mp3", // Path to the custom notification sound
    },
  },
};


    try {
        const response = await admin.messaging().send(message);
   
    } catch (error) {

    }



    }
    


async function publishTextOrLinkPost( message) {

    var info = `⚽🔔${message} \n  check stats👉 www.sportsupd.com`
    
  try {
          const data = await model_schema.find()
         
    const response = await axios.post(`
      https://graph.facebook.com/v21.0/${data[0]["id"]}/feed`,
      {
        message: info,
        published: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data[0]["token"]}`,
        },
      }
    );
  
    return response.data.id;
  } catch (error) {
    
    throw error;
  }
}

async function match_update(datam){


    publishTextOrLinkPost(datam)


}
var main_ids = [ 
         id: 87,
        id: 55,
        id: 53, 
        id: 54, 
        id: 47, 
        id: 42, 
    ]


    const change = JSON.parse(message.match)
     switch (message.type) {
            case 'start':


                match_update(`Match Started: \n ${change.home.name} vs ${change.away.name}`);


                break;
            case 'end':
                match_update(`Match Ended: \n ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}`);
                break;


            case 'goal':

                if(main_ids.includes(change.leagueId)){
                match_update(`Goal!\n  ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}.`);
            }
                break;

              case 'HT':
               match_update(`HalfTime! \n ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}.`);
                break;

            case 'Second_Half':
                match_update(`Second_Half! ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}.`);
                break;
        }

        const item = await register_model.find()


        item.map((user)=>{

            let notify = false

               if (user.favorite_league.length > 0) {
                const leagueMatches = user.favorite_league.filter(i => JSON.parse(i).id === change.leagueId);
                if (leagueMatches.length > 0) notify = true;
            }

            if (user.favorite_team.length > 0) {
                const teamMatches = user.favorite_team.filter(i => 
                    JSON.parse(i).id === change.home.id || 
                    JSON.parse(i).id === change.away.id
                );
                if (teamMatches.length > 0) notify = true;
            }

            if (user.pinned_matches.length > 0) {
                const pinnedMatches = user.pinned_matches.filter(i => JSON.parse(i).id === change.id);
                if (pinnedMatches.length > 0) notify = true;
            }

            
             if (notify) {
        
                 switch (message.type) {
            case 'start':
                final_sender(user.phone_string, "Match Started", `Match Started: ${change.home.name} vs ${change.away.name}`);
                break;
            case 'end':
                final_sender(user.phone_string, "Match Ended", `Match Ended: ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}`, );
                break;
            case 'goal':
                final_sender(user.phone_string, "Goal", `Goal! ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}. `, user.phone_string);
                break;

               case 'HalfTime':
                final_sender(user.phone_string, "Half Time", `HalfTime ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}. `, user.phone_string);
                break;

            case 'Second_Half':
                final_sender(user.phone_string, "Second_Half", `Second Half started ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}. `, user.phone_string);
                break;
        }
            }
        })

}

// Start fetching data
fetchData();
