const { register_model } = require("./auth.js");
const axios = require("axios");
const { model_schema } = require("./auth.js");
const admin = require('./firebaseAdmin'); // Adjust the path as necessary
let previousData = [];
let previousnews = [];

require('dotenv').config();
async function send_news(title, link, img) {
  const users = await register_model.find();
  for (const user of users) {
    const message = {
      notification: {
        title,
        body: title,
      },
      webpush: {
        fcmOptions: {
          link: "https://www.lonescore.com/news",
        },
        notification: {
          icon: img,
          sound: "/sounds/example_sound.mp3",
        },
      },
      token: user.phone_string,
    };
    try {
      await admin.messaging().send(message);
    } catch (error) {
      // Optionally log error
    async function send_notification(change) {
      // Only notify users who follow the league, team, player, or have pinned the match
      const match = typeof change.match === 'string' ? JSON.parse(change.match) : change.match;
      const users = await register_model.find();
      for (const user of users) {
        let notify = false;
        // League
        if (Array.isArray(user.favorite_league) && user.favorite_league.length > 0) {
          if (user.favorite_league.some(i => JSON.parse(i).id === match.leagueId)) notify = true;
        }
        // Team
        if (Array.isArray(user.favorite_team) && user.favorite_team.length > 0) {
          if (
            user.favorite_team.some(i => JSON.parse(i).id === match.home.id) ||
            user.favorite_team.some(i => JSON.parse(i).id === match.away.id)
          ) notify = true;
        }
        // Player (for goal events, if scorer matches favorite_player)
        if (Array.isArray(user.favorite_player) && user.favorite_player.length > 0 && change.type === "goal" && match.scorerId) {
          if (user.favorite_player.includes(String(match.scorerId))) notify = true;
        }
        // Pinned matches
        if (Array.isArray(user.pinned_matches) && user.pinned_matches.length > 0) {
          if (user.pinned_matches.some(i => JSON.parse(i).id === match.id)) notify = true;
        }
        if (!notify) continue;
        // Compose notification message
        let title = "";
        let body = "";
        switch (change.type) {
          case "start":
            title = "Match Started";
            body = `Match Started: ${match.home.name} vs ${match.away.name}`;
            break;
          case "end":
            title = "Match Ended";
            body = `Match Ended: ${match.home.name} ${match.home.score} - ${match.away.score} ${match.away.name}`;
            break;
          case "goal":
            title = "Goal";
            body = `Goal! ${match.home.name} ${match.home.score} - ${match.away.score} ${match.away.name}. Scorer: ${change.team}`;
            break;
          case "HalfTime":
            title = "Half Time";
            body = `HalfTime! ${match.home.name} ${match.home.score} - ${match.away.score} ${match.away.name}.`;
            break;
          case "Second_Half":
            title = "Second Half";
            body = `Second Half started: ${match.home.name} ${match.home.score} - ${match.away.score} ${match.away.name}.`;
            break;
          default:
            title = "Match Update";
            body = "Match update.";
        }
        const message = {
          notification: {
            title,
            body,
          },
          token: user.phone_string,
          webpush: {
            fcmOptions: {
              link: `https://lonescore.com/result/${match.id}`,
            },
            notification: {
              icon: `https://images.fotmob.com/image_resources/logo/leaguelogo/${match.leagueId}.png`,
              sound: "/sounds/example_sound.mp3",
            },
          },
        };
        try {
          await admin.messaging().send(message);
        } catch (error) {
          // Optionally log error
        }
      }
    }
        
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
    link: `https://lonescore.com/result/${changed.id}`, // Corrected link format
  },
  notification: {
    icon: `https://images.fotmob.com/image_resources/logo/leaguelogo/${changed.leagueId}.png`, // Updated icon URL
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

    var info = `⚽🔔${message} \n  check stats👉 www.lonescore.com`
    
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
                main_ids.map((item)=>{
                    if(change.parentId == item){
                         match_update(`Goal!\n  ${change.home.name} ${change.home.score} - ${change.away.score} ${change.away.name}.`);
                    }
                    else{
                        console.log("not posting because Item not available")
                    }


                })
              
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


