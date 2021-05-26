var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const games_utils = require("./utils/game_utils");

//insert new game to the database
router.post("/basicInfo", async (req, res, next) => { 
  try {
      
      // parameters exists
      // valid parameters
      // teams exists in same date
      const dates_teams = await DButils.execQuery(
        "SELECT date, away_team_name, home_team_name, field_name FROM dbo.games");
           
      //DButils.check_date_for_teams(req.body,dates_teams);
    
      //check if teams free depend on date
      if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  (x.home_team_name === req.body.home_team_name || x.home_team_name === req.body.away_team_name
    || x.away_team_name === req.body.home_team_name || x.away_team_name === req.body.away_team_name)))
      throw { status: 401, message: "one of the team have game in this date"};

      //check if field free depend on date
      if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  (x.field_name === req.body.field_name )))
      throw { status: 401, message: "this field is not free"};
  
      // add the new game
      await DButils.execQuery(
        `INSERT INTO dbo.games (date, time, home_team_name, away_team_name, field_name, referee) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.home_team_name}'
        , '${req.body.away_team_name}', '${req.body.field_name}', '${req.body.referee}')`
      );
      res.status(201).send("game created");
    } catch (error) {
      next(error);
    }
  });


  router.get("/fullInfo", async (req, res, next) =>{
    try {
      let game_ids_array = [];
      const results_game = await games_utils.getAllGame(game_ids_array);
      res.status(200).send(results_game);
    } catch (error) {
      next(error)
    }
  })


  router.post("/score", async (req, res, next) =>{
    try {
      await DButils.execQuery(
      `insert into dbo.games (goal_home, goal_away) values ('${req.body.goal_home}', '${req.body.goal_away}') where game_id='${req.body.game_id}'` 
    );
    res.status(201).send("score added to the game");
    } catch (error) {
      next(error)
    }

  })
  
  module.exports = router;