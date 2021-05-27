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

module.exports = router;
