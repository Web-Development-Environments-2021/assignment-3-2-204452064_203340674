var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const games_utils = require("./utils/game_utils");

router.get("/fullInfo/:teamID", async (req, res, next) => {
  let team_details = {};
  try {
    //logo and name
    const team_name_logo_coach = await teams_utils.getTeambasicDetailsByID(req.params.teamID);
    team_details.id = parseInt(req.params.teamID); 
    team_details.name = team_name_logo_coach.name;
    team_details.image = team_name_logo_coach.image;
    team_details.coach = team_name_logo_coach.coach;
    const team_players_details = await players_utils.getPlayersByTeam(req.params.teamID);
    team_details.players = team_players_details;
    let games = await games_utils.getAllgameByGroupSortPastFuture(team_name_logo_coach.name);
    team_details.past_games = games[0];
    team_details.future_games = games[1];
    res.send(team_details);
  } catch (error) {
    next(error);
  }

});
router.get("/basicInfoName/:teamName", async(req, res, next) =>{    
  try {
      let team_det = await teams_utils.getTeambasicDetailsByName(req.params.teamName);
      var team_det_filtered = team_det.filter(function(x) {
        return x !== undefined;
   });
      res.send(team_det_filtered);
  } catch (error) {
      next(error);
  }
});
router.get("/basicInfoID/:teamID", async(req, res, next) =>{    
  try {
      let team_det = await teams_utils.getTeambasicDetailsByID(req.params.teamID);
      res.send(team_det);
  } catch (error) {
      next(error);
  }
});

module.exports = router;
