var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.post("/basicInfo", async (req, res, next) => { 
  try {
      
      // parameters exists
      // valid parameters
      // teams exists in same date
      const games = await DButils.execQuery(
        "SELECT date FROM dbo.games_future_games"
      );
      console.log(req.body.date);
      console.log(games[0].date.getDate());
      if (games.find((x) => x.date.getDate() === req.body.date))
        throw { status: 401, message: "wrong input parameters" };
        // if(x.away_team_id === req.body.home_team_id || x.home_team_id === req.body.home_team_id)
        //   throw { status: 409, message: "home team alredy have a game in this date" };
        // if(x.away_team_id === req.body.away_team_id || x.home_team_id === req.body.away_team_id)
        //   throw { status: 409, message: "away team alredy have a game in this date" };  
  
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