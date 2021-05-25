var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/fullInfo/:playerId", async(req, res, next) =>{

    try {
        const player_det = await players_utils.getPlayerfullDetails(req.params.playerId);
        res.send(player_det);
    } catch (error) {
        next(error);
    }
});

module.exports = router;