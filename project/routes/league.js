var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const game_utils = require("./utils/game_utils");

router.get("/leagueDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});
router.get("/searchAll", async (req, res, next) => {
  try {
    const allData = await league_utils.getAllData(17328);
    res.send(allData);
  } catch (error) {
    next(error);
  }
});

router.get("/AllTeamsNames", async(req, res, next) =>{
  try{
    const allTeams = await league_utils.getAllTeamsAsArray(17328);
    res.send(allTeams);
  }
  catch (error) {
    next(error);
  }
})
module.exports = router;
