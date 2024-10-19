    const {register_model} = require("./auth.js")
    const axios = require("axios")
    const api = require("./details.js")





    let d = new Date()




    let previousData = [];
    let newData = [];
    async function fetchData() {

        try{
           const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await fetch('https://ipapi.co/json/');
            const { country_code: userCode } = await response.json();

            const date = new Date();
            const formatted_date = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

           


        const res = await axios.get('https://www.fotmob.com/api/matches', {
      params: {
        'date': formatted_date,
        'timezone': userTimeZone,
        'ccode3': userCode
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': '_cc_id=fd3b698f700d90530b559e2e0982d514; _pubcid=e0c28140-8d67-4033-a102-155ad81db4e4; _pubcid_cst=zix7LPQsHA%3D%3D; _au_1d=AU1D-0100-001718667612-LQHKCG03-USAL; _ga=GA1.1.2119553545.1718667549; _ga_SQ24F7Q7YW=GS1.1.1720792900.1.0.1720792905.0.0.0; _ga_K2ECMCJBFQ=GS1.1.1720792846.1.0.1720792906.0.0.0; g_state={"i_p":1726823972069,"i_l":4}; u:location=%7B%22countryCode%22%3A%22LR%22%2C%22ccode3%22%3A%22LBR%22%2C%22timezone%22%3A%22Africa%2FMonrovia%22%2C%22ip%22%3A%2241.57.95.17%22%7D; panoramaId_expiry=1724708892203; __gads=ID=92d5d724039964be:T=1718667552:RT=1724622850:S=ALNI_MaDE1K0PYrz7DyLAYDwmlqRSaVU4w; __gpi=UID=00000e3edcb15e28:T=1718667552:RT=1724622850:S=ALNI_MbTHt_CqKudRyJHJ7GDrOBF642EAg; __eoi=ID=a1c3f7154f50fa8b:T=1718667552:RT=1724622850:S=AA-AfjZ02jQeU68iiwfAT-o6Usbz; FCNEC=%5B%5B%22AKsRol_65fl2BCam6CtxfePKpLRkPdUO_bwsgl9frt0WdHBRsObInsSnmx9f2c_PGGuz1azHY1cMpbQtdX0g6VpNnYhGitSBd9Kd1KeUU6VO328_HrIsBJbMMy8gpRR-uRCGaLQixc5IphO8HBJPlyqjPVp6BnDF1A%3D%3D%22%5D%5D; _ga_G0V1WDW9B2=GS1.1.1724622480.11.1.1724622929.0.0.0',
        'if-none-match': '"124nd1hpwk06500"',
        'priority': 'u=1, i',
        'referer': 'https://www.fotmob.com/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 Edg/128.0.0.0',
        'x-fm-req': 'eyJib2R5Ijp7ImNvZGUiOjE3MjQ2MjI5Mjk4MTJ9LCJzaWduYXR1cmUiOiIyNkI4MjhBNjgxQTlDOTI3QTVBNzdDMUNFQzFBOTQ4MCJ9'
      }

            
            })
        const data = res.data
            data.leagues.forEach((element)=>{
                element.matches.map((item)=>{
                    newData.push(item)
                })
            })
             // Assume the entire data is sent for simplicity
        
        
        // Compare newData with previousData to find changes
        const changes = findChanges(previousData, newData);

        // Process changes and send notifications
        processChanges(changes);

        // Update previousData to 

        	previousData = newData

            console.log(previousData)


        }catch(error){

          console.error('Error fetching data:' + error);
    }
        

    setTimeout(fetchData, 10000)

      
    }

    	fetchData()


    const send_notification = (item)=>{


    							console.log(item)
    }



    async function findChanges(previousData, newData) {
        // For simplicity, let's assume this function detects changes based on IDs or some other criteria
        // In real scenario, you might use a more sophisticated comparison logic
        const changes = [];


        // Example: Compare IDs to detect changes
        for (let i = 0; i < newData.length; i++) {
            const newItem = newData[i];
            const foundInPrevious = previousData.find(item => item.match_id === newItem.match_id );
            const item = await register_model.find()
            
            	
            if(foundInPrevious == undefined){
            	

            }

            else{

            	if(newItem.status.liveTime && !foundInPrevious.status.liveTime && !newItem.status.reason && !foundInPrevious.status.reason){
            			

                                item.forEach((damn)=>{
                                        const element = damn

                                   
                                    const t_array = element.favorite_team.filter((it)=> it.id == newItem.away.id || it.id == newItem.home.id )
                                      const l_array = element.favorite_league.filter((it)=> it.id == newItem.leagueId)
                                    const pinned = element.pinned_matches.filter((it)=> it.id == newItem.id)

                                    console.log(`"Match Started "+${newItem.home.name}+" vs"+${newItem.away.name}  ${JSON.stringify(newItem.status.liveTime)}, ${JSON.stringify(foundInPrevious.status.liveTime)}` )

                                    

                                    if(t_array.length > 0){
                                        send_notification({event : `"Match Started "+${newItem.home.name}+" vs"+${newItem.away.name}, userToken : ${element.phone_string}` })
                                    }

                                    if(l_array.length > 0){
                                     send_notification({event : `"Match Started ",${newItem.home.name}," vs",${newItem.away.name}, userToken : ${element.phone_string}` })
                                    }

                                     if(pinned.length > 0){
                                     send_notification({event : `"Match Started ",${newItem.home.name}," vs",${newItem.away.name}, userToken : ${element.phone_string}` })
                                    }

                                })

            				}

                          else  if(newItem.status.finished != foundInPrevious.status.finished){
                        

                                item.forEach((damn)=>{
                                        const element = damn

                                   
                                    const t_array = element.favorite_team.filter((it)=> it.id == newItem.away.id || it.id == newItem.home.id )
                                      const l_array = element.favorite_league.filter((it)=> it.id == newItem.leagueId)
                                    const pinned = element.pinned_matches.filter((it)=> it.id == newItem.id)


                                    console.log( `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` )

                                    if(t_array.length > 0){
                                        send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }

                                    if(l_array.length > 0){
                                    send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }
                                    if(pinned.length > 0){
                                    send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }

                                })

                            }

                          else if(newItem.status.liveTime === "HT" && foundInPrevious.status.liveTime != "HT"){
                        

                                item.forEach((damn)=>{
                                        const element = damn

                                   
                                    const t_array = element.favorite_team.filter((it)=> it.id == newItem.away.id || it.id == newItem.home.id )
                                      const l_array = element.favorite_league.filter((it)=> it.id == newItem.leagueId)
                                    const pinned = element.pinned_matches.filter((it)=> it.id == newItem.id)
                                    

                                    console.log(`${newItem.status.liveTime.long}, ${newItem.home.name}, " vs", ${newItem.away.name}, userToken : ${element.phone_string}`)

                                    if(t_array.length > 0){
                                        send_notification({event : `${newItem.status.liveTime.long}, ${newItem.home.name}, " vs", ${newItem.away.name}, userToken : ${element.phone_string}` })
                                    } 
      
                                    if(l_array.length > 0){
                                       send_notification({event : `${newItem.status.liveTime.long}, ${newItem.home.name}, " vs", ${newItem.away.name}, userToken : ${element.phone_string}` })
                                    }

                                    if(pinned.length > 0){
                                    send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }

                                })

                            }


                    else if(newItem.home.score != foundInPrevious.home.score){

                         item.forEach((damn)=>{
                                        const element = damn

                                   
                                    const t_array = element.favorite_team.filter((it)=> it.id == newItem.away.id || it.id == newItem.home.id )
                                      const l_array = element.favorite_league.filter((it)=> it.id == newItem.leagueId)
                                    const pinned = element.pinned_matches.filter((it)=> it.id == newItem.id)

                                     console.log(`"Goal ", ${newItem.home.name},"Scores","["+${newItem.home.score}+"]:"+${newItem.away.score}, userToken : ${element.phone_string} `)

                                    

                                    if(t_array.length > 0){
                                        send_notification({event : `"Goal ", ${newItem.home.name},"Scores","["+${newItem.home.score}+"]:"+${newItem.away.score}, userToken : ${element.phone_string} `})
                                    }

                                    if(l_array.length > 0){
                                        send_notification({event : `"Goal ", ${newItem.home.name},"Scores","["+${newItem.home.score}+"]:"+${newItem.away.score}, userToken : ${element.phone_string} `})
                                     }
                                     if(pinned.length > 0){
                                    send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }

                                })
                    }

                    else if(newItem.away.score != foundInPrevious.away.score){

                         item.forEach((damn)=>{
                                        const element = damn

                                   
                                    const t_array = element.favorite_team.filter((it)=> it.id == newItem.away.id || it.id == newItem.home.id )
                                    const l_array = element.favorite_league.filter((it)=> it.id == newItem.leagueId)
                                    const pinned = element.pinned_matches.filter((it)=> it.id == newItem.id)

                                     
                                        console.log( `"Goal ",${newItem.away.name},"Scores", ${newItem.home.score}+":["+${newItem.away.score}+"]", userToken : ${element.phone_string}` )
                                    

                                    if(t_array.length > 0){
                                        send_notification({event : `"Goal ",${newItem.away.name},"Scores", ${newItem.home.score}+":["+${newItem.away.score}+"]", userToken : ${element.phone_string}` })
                                    }

                                    if(l_array.length > 0){
                                        send_notification({event : `"Goal ",${newItem.away.name},"Scores", ${newItem.home.score}+":["+${newItem.away.score}+"]", userToken : ${element.phone_string}` })
                                     }
                                     if(pinned.length > 0){
                                    send_notification({event : `"Match Ended ", ${newItem.home.name}," vs", ${newItem.away.name + newItem.scoreStr}, userToken : ${element.phone_string}` })
                                    }

                                })
                    }

            				
                               
            			
                             
            	else{


            		
            	}
            }

           

            /*if (!foundInPrevious || foundInPrevious.status !== newItem.status) {
                // If not found in previous or status changed, consider it as a change
                changes.push(newItem);
            }*/
        }

        return changes;
    }




    // Function to process changes and send notifications
    function processChanges(changes) {
        
    }

