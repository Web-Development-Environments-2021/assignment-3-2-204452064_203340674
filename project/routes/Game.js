const { errorMonitor } = require("events");
var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const games_utils = require("./utils/game_utils");


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

  
  module.exports = router;