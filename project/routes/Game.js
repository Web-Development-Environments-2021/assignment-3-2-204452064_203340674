var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/basicInfo", async (req, res, next) => { 
  try {
      
      // parameters exists
      // valid parameters
      // teams exists in same date
      const dates_teams = await DButils.execQuery(
        "SELECT date, away_team_id, home_team_id, field_id FROM dbo.games_future_games");
      
      
      //DButils.check_date_for_teams(req.body,dates_teams);
    
      //check if teams free depend on date
      if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  (x.home_team_id === req.body.home_team_id || x.home_team_id === req.body.away_team_id
    || x.away_team_id === req.body.home_team_id || x.away_team_id === req.body.away_team_id)))
      throw { status: 401, message: "one of the team have game in this date"};

      //check if field free depend on date
      if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  (x.field_id === req.body.field_id )))
      throw { status: 401, message: "this field is not free"};
  
      // add the new game
      await DButils.execQuery(
        `INSERT INTO dbo.games_future_games (date, time, home_team_id, away_team_id, field_id) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.home_team_id}'
        , '${req.body.away_team_id}', '${req.body.field_id}')`
      );
      res.status(201).send("game created");
    } catch (error) {
      next(error);
    }
  });
  module.exports = router;