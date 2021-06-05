const { errorMonitor } = require("events");
var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const games_utils = require("./utils/game_utils");
  router.post("/score", async (req, res, next) =>{
    try {
      const games = await DButils.execQuery(`SELECT * FROM dbo.games where game_id='${req.body.game_id}'`);
      if (games.length!= 0){
        await DButils.execQuery(
        `UPDATE dbo.games set goal_home='${req.body.goal_home}', goal_away='${req.body.goal_away}' where game_id='${req.body.game_id}'` 
      );
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


router.get("/allGame", async (req, res, next) =>{
  try {
    let game_ids_array = [];
    const results_game = await games_utils.getAllGame(game_ids_array);
    res.status(200).send(results_game);
  } catch (error) {
    next(error)
  }
})

router.get("/referee", async (req, res, next) =>{
  try {
    const allreferee= await games_utils.getRefereesNames();
    res.send(allreferee);
  } catch (error) {
    next(error)
  }
})
router.get("/field", async (req, res,next) =>{
  try{
    const allFields = await games_utills.getFieldsNames();
    res.send(allFields); 
  }catch(error){
    next(error)
  }
})

  
  module.exports = router;