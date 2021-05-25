const axios = require("axios");
const LEAGUE_ID = 271;
// our addition for next game query
// const DButils = require("../routes/utils/DButils");
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
  // const next_game = (await DButils.execQuery( `SELECT * FROM dbo.games_future_games WHERE date < '${current_date}'ORDER BY date DESC`))
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
    // next_game: next_game,
  };
}
exports.getLeagueDetails = getLeagueDetails;
