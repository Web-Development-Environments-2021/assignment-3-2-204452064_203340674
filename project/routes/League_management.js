var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const games_utils = require("./utils/game_utils");


router.use(function (req, res, next) {
     if (req.session.user_id === 6) { 
      next();
    }
    else {
      res.status(403).send("no appropriate permissions");
  }
});

//insert new game to the database
router.post("/basicInfo", async (req, res, next) => { 
  try { 
    const mess = await games_utils.insertNewGame(req.body);
    // if(mess != "game created" ){ 
    //   res.status(409).send(mess);
    // }
    // else{
    //   res.status(201).send(mess);
    // }
    res.status(201).send(mess);
  } catch (error) {
    next(error);
  }
});

  //-------------old--------------------------
  // try { 
  //     // parameters exists
  //     // valid parameters
  //     // teams exists in same date
  //     const dates_teams = await DButils.execQuery(
  //       "SELECT date, away_team_name, home_team_name, field_name FROM dbo.games");
           
  //     //DButils.check_date_for_teams(req.body,dates_teams);
    
  //     //check if teams free depend on date
  //     if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  // (x.home_team_name === req.body.home_team_name || x.home_team_name === req.body.away_team_name
  //   || x.away_team_name === req.body.home_team_name || x.away_team_name === req.body.away_team_name)))
  //     throw { status: 401, message: "one of the team have game in this date"};

  //     //check if field free depend on date
  //     if (dates_teams.find((x) => x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === req.body.date && 
  // (x.field_name === req.body.field_name )))
  //     throw { status: 401, message: "this field is not free"};
  
  //     // add the new game
  //     await DButils.execQuery(
  //       `INSERT INTO dbo.games (date, time, home_team_name, away_team_name, field_name, referee) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.home_team_name}'
  //       , '${req.body.away_team_name}', '${req.body.field_name}', '${req.body.referee}')`
  //     );
  //     res.status(201).send("game created");
  //   } catch (error) {
  //     next(error);
  //   }
  // });
  //-------------old--------------------------

  router.post("/score", async (req, res, next) =>{
    try {
      await DButils.execQuery(
      `UPDATE dbo.games set goal_home='${req.body.goal_home}', goal_away='${req.body.goal_away}' where game_id='${req.body.game_id}'` 
    );
      res.status(201).send("score added to the game");
    } catch (error) {
      next(error)
    }
  })
  // router.post("/score", async (req, res, next) =>{
  //   try {
  //     const games = await DButils.execQuery(`SELECT * FROM dbo.games where game_id='${req.body.game_id}'`);
  //     if (games.length!= 0){
  //       await DButils.execQuery(
  //       `UPDATE dbo.games set goal_home='${req.body.goal_home}', goal_away='${req.body.goal_away}' where game_id='${req.body.game_id}'` 
  //     );
  //       res.status(201).send("score added to the game");}
  //       else{res.status(400).send("this game id doesnt exist");}
  //   } catch (error) {
  //     next(error)
  //   }
  // })

  router.post("/events", async (req, res, next) =>{
    try {
      await DButils.execQuery(
        `INSERT INTO games_events (game_id, date, time, minute, event_name, player_id_1, player_id_2) VALUES ('${req.body.gameID}', '${req.body.date}', '${req.body.time}','${req.body.minAtGame}',
        '${req.body.eventName}', '${req.body.player1}', '${req.body.player2}')`
        );
        res.status(201).send("event added to the game's events Schedule");
    } catch (error) {
      next(error)
    }
  })

  module.exports = router;