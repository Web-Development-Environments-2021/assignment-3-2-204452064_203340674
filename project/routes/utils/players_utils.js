const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team,trophies",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}
//use when search name of player. supply preview of all players with same name:
async function getPlayerbasicDetailsByName(player_name){
  
  const all_player_with_same_name = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team.league", 
      },
    })
    return all_player_with_same_name.data.data.map((player_info) => {
      if(player_info != undefined)
      {
        const { fullname, image_path, position_id } = player_info;
        if( player_info.team != undefined)
        {
          const { name } = player_info.team.data;
          if(player_info.team.data.league != undefined)
          {S
            const {id} = player_info.team.data.league.data;
            if(id == 271) 
            {
              return {
                  name: fullname,
                  image: image_path,
                  position: position_id,
                  team_name: name,       
                };
            }
          }
        }
      }  
      
    }); 
  }


    

//get player full info for self page

async function getPlayerfullDetails(player_id){
  const player_info = await axios.get(`${api_domain}/players/${player_id}`, {
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  })
  const { fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight } = player_info.data.data;
  const { name } = player_info.data.data.team.data;
  
  return{
    name: fullname,
    image: image_path,
    position: position_id,
    team_name: name,
    common_name: common_name,
    nationality_player :nationality,
    birth_date : birthdate,
    birth_country : birthcountry,
    height: height,
    weight: weight,
    
  };
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    const { length } = player_info.data.data.trophies.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      number_of_trophies: length,};

  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerfullDetails = getPlayerfullDetails;
exports.getPlayerbasicDetailsByName = getPlayerbasicDetailsByName
