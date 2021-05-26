var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/fullInfo/:teamID", async (req, res, next) => {
  let team_details = [];
  try {
    const team_players_details = await players_utils.getPlayersByTeam(req.params.teamID);
    team_details.push(team_players_details);
    const coach = await teams_utils.getCoach(req.params.teamID)
    team_details.push(coach);
    //const team_past_games_by_Season_ID = await
    // const team_future_games = await 
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
  }

});

module.exports = router;
