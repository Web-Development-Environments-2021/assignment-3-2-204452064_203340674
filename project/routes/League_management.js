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
    res.status(201).send(mess);
  } catch (error) {
    next(error);
  }
});

  router.post("/score", async (req, res, next) =>{
    let today = new Date()
    try {
      const games = await DButils.execQuery(`SELECT * FROM dbo.games where game_id='${req.body.game_id}'`);
      if (games.length!= 0){
        if (games[0].date < today){    
          await DButils.execQuery(
          `UPDATE dbo.games set goal_home='${req.body.goal_home}', goal_away='${req.body.goal_away}' where game_id='${req.body.game_id}'` 
      );
    }
    else{
      res.status(400).send("date must be in past");
    }      
      res.status(201).send("score added to the game");}
      else{res.status(400).send("this game id doesnt exist");}
    } catch (error) {
      next(error)
    }
  })

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