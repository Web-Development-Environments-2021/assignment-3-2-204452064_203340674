const axios = require("axios");
const LEAGUE_ID = 271;
const STAGE_ID = 77453566;
// our addition for next game query
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${STAGE_ID}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  
  let today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10);
  const next_game = (await DButils.execQuery( `SELECT TOP 1 date, time, home_team_name, away_team_name, field_name, referee  FROM dbo.games WHERE date>'${today}' ORDER BY date ASC`))
  const date = next_game[0].date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10);
  const time = next_game[0].time.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(10,20);
  const home = next_game[0].home_team_name;
  const away = next_game[0].away_team_name;
  const field = next_game[0].field_name;
  const referee = next_game[0].referee;
  
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
    next_game_date : date,
    next_game_time : time,
    next_game_home : home,
    next_game_away : away,
    next_game_field : field,
    next_game_referee : referee,
  };
}
async function getAllData(season_id){
  const leagueTeams = await axios.get(`${api_domain}/teams/season/${season_id}`,{
    params: {
      include: "squad.player.position",
      api_token: process.env.api_token,
    },
  });
  let allTeams = [];
  let allPlayers = [];
  let allPositions = new Set();
  leagueTeams.data.data.map((team_info)=>{
    allTeams.push(team_info.name);
    allPlayers = allPlayers.concat(team_info.squad.data.map((player_info)=>{
      allPositions.add(player_info.player.data.position.data.name);
      return player_info.player.data.display_name;
    }))
  });
  return{
    teams: allTeams,
    players: allPlayers,
    positions: Array.from(allPositions),

  }
}
async function getAllTeamsAsArray(season_id){
  const leagueTeams = await axios.get(`${api_domain}/teams/season/${season_id}`,{
    params: {
      api_token: process.env.api_token,
    },
  });
  let allTeams = [];
  leagueTeams.data.data.map((team_info)=>{
    allTeams.push(team_info.name);
    }
    );
    return allTeams;

}
exports.getLeagueDetails = getLeagueDetails;
exports.getAllData = getAllData;
exports.getAllTeamsAsArray = getAllTeamsAsArray;
