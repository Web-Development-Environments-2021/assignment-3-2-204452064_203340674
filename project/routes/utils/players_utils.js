const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

//this function get team_id and return list of player's id
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

//this function get list of player's id and call to extract all relevant data of all players, 
//function for player in teams
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
//use when user search name of player. supply preview of all players with same name:
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
        const { player_id, fullname, image_path, position_id } = player_info;
        if(fullname.includes(player_name))
        {
        if( player_info.team != undefined)
        {
          const { name } = player_info.team.data;
          if(player_info.team.data.league != undefined)
          {
            const {id} = player_info.team.data.league.data;
            if(id == 271) 
            {
              return {
                  id: player_id,
                  name: fullname,
                  image: image_path,
                  position: position_id,
                  team_name: name,       
                };
            }
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
    id: player_id,
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
//this function get list of players info and extract specific fields 
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    if (player_info.data.data != undefined){
    
    const { player_id ,fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    const { length } = player_info.data.data.trophies.data;
    return {
      id: player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      number_of_trophies: length,};

  }});
}
//this function get team_id and return all info about team's players
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

//this function get player name and team name and return info of player that have specific name and associated to specific team
async function getPlayerbasicDetailsByTeam(player_name, team_name){
  const all_player_with_same_name = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team.league", 
      },
    })
    return all_player_with_same_name.data.data.map((player_info) => {
      if(player_info != undefined && player_info.team != undefined)
      {
        const { player_id, fullname, image_path, position_id } = player_info;
        if(fullname.includes(player_name))
        {
        if( player_info.team.data.name == team_name)
        {
          const { name } = player_info.team.data;
          if(player_info.team.data.league != undefined)
          {
            const {id} = player_info.team.data.league.data;
            if(id == 271) 
            {
              return {
                  id: player_id,
                  name: fullname,
                  image: image_path,
                  position: position_id,
                  team_name: name,       
                };
            }
          }
        }
      }
      }  
      
    }); 
  }
  //this function get player name and team name and return info of player that have specific name and associated to specific team
async function getPlayerbasicDetailsByPosition(player_name, position_name){
  const all_player_with_same_name = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team.league, position", 
      },
    })
    return all_player_with_same_name.data.data.map((player_info) => {
      if(player_info != undefined && player_info.team != undefined && player_info.position != undefined)
      {
        const { player_id, fullname, image_path, position_id } = player_info;
        if(fullname.includes(player_name))
        {
          if( player_info.position.data.name == position_name)
          {
            const { name } = player_info.team.data;
            if(player_info.team.data.league != undefined)
            {
              const {id} = player_info.team.data.league.data;
              if(id == 271) 
              {
                return {
                    id: player_id,
                    name: fullname,
                    image: image_path,
                    position: position_id,
                    position_name: player_info.position.data.name,
                    team_name: name,       
                  };
              }
            }
          }
        } 
      }
      }); 
  }  

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerfullDetails = getPlayerfullDetails;
exports.getPlayerbasicDetailsByName = getPlayerbasicDetailsByName;
exports.getPlayerbasicDetailsByTeam =getPlayerbasicDetailsByTeam;
exports.getPlayerbasicDetailsByPosition = getPlayerbasicDetailsByPosition;