const { model_schema } = require("./auth.js");
let previousData = [];
let previousnews = [];

var changes_list = []
var holder 

const axios = require("axios");


async function  lets_return() {
  // body...

  return(holder)
}

async function fetchData() {
    try {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDate = getFormattedDate();
        const newData = await fetchMatches(formattedDate);

        // Skip if no data (tokens not ready yet)
        if (!newData) {
            return;
        }

        // Log changes only when they happen
        if (changes_list.length > 0) {
            console.log(`📊 [Match Updates] ${changes_list.length} changes detected`);
        }

        holder = newData;
        previousData = newData;
    } catch (error) {
        console.error('❌ Error fetching match data:', error.message || error);
    } finally {
        setTimeout(fetchData, 5000);  // Fetch data again after 5 seconds
    }
}
fetchData()

function getFormattedDate() {
    const date = new Date();
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

async function fetchMatches(date) {

  const data = await model_schema.find();
  
  // Check if token data exists
  if (!data || data.length === 0 || !data[0]?.variable) {
    console.log('⏳ [Match Reload] Waiting for tokens to be generated...');
    return null;
  }
      
   const res = await axios.get('https://www.fotmob.com/api/data/matches', {
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

    const matches = res.data.leagues.flatMap(league =>
  league.matches.map(match => ({
    ...match,
    parentId: league.parentLeagueId
  }))
);
    
    return(res.data)
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
               // send_notification({ type: 'end', match : JSON.stringify(newItem)  }); // Match ended
            }

            if (newItem.home.score !== foundInPrevious.home.score) {
                //send_notification({ type: 'goal', match : JSON.stringify(newItem) , team: newItem.home.name });
                changes_list.push(item)

                console.log(changes_list, list)
            }

            if (newItem.away.score !== foundInPrevious.away.score) {
              //  send_notification({ type: 'goal', match : JSON.stringify(newItem) , team: newItem.away.name });
            }

                if(newItem.status.liveTime){
            if(newItem.status.liveTime.short == "HT" && foundInPrevious.status.liveTime.short != "HT"){
                //send_notification({ type: 'HalfTime', match : JSON.stringify(newItem) , team: newItem.away.name });
            }
            if(newItem.status.liveTime.short == "1" ){
               // send_notification({ type: 'start', match: JSON.stringify(newItem) })
            }
}
        }
    }

    return changes; // Always return an array



}

module.exports = lets_return