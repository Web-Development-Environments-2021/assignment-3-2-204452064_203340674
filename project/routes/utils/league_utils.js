const axios = require("axios");
const LEAGUE_ID = 271;
// our addition for next game query
const DButils = require("./DButils");
// current_date = new Date();

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
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  const next_game = (await DButils.execQuery( `SELECT date, time, home_team_name, away_team_name, field_name, referee FROM dbo.games WHERE date=(SELECT MAX(date) From dbo.games)`))
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
exports.getLeagueDetails = getLeagueDetails;
