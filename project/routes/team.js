var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/fullInfo/:teamID", async (req, res, next) => {
  let team_details = [];
  try {
    //logo and name
    const team_name_logo = await teams_utils.getTeambasicDetailsByID(req.params.teamID);
    team_details.push(team_name_logo);
    ////players of team include names,pic,number of thripies
    const team_players_details = await players_utils.getPlayersByTeam(req.params.teamID);
    team_details.push(team_players_details);
    //teams coach
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
router.get("/basicInfoName/:teamName", async(req, res, next) =>{    
  try {
      let team_det = await teams_utils.getTeambasicDetailsByName(req.params.teamName);
      res.send(team_det);
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
