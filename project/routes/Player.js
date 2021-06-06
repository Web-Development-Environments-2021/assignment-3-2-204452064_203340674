var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

// get for search page - this search allow full name and part of name:
router.get("/basicInfo/:playerName", async(req, res, next) =>{ 
    
    try {
        let player_det = await players_utils.getPlayerbasicDetailsByName(req.params.playerName);
        var player_det_filtered = player_det.filter(function(x) {
            return x !== undefined;
       });
        res.send(player_det_filtered);
    } catch (error) {
        next(error);
    }
});
router.get("/fullInfo/:playerId", async(req, res, next) =>{

    try {
        const player_det = await players_utils.getPlayerfullDetails(req.params.playerId);
        res.send(player_det);
    } catch (error) {
        next(error);
    }
});
router.get("/basicInfoByTeam/:playerName/:teamName", async(req, res, next) =>{
    try{
        const player_det = await players_utils.getPlayerbasicDetailsByTeam(req.params.playerName, req.params.teamName);
        var player_det_filtered = player_det.filter(function(x) {
            return x !== undefined;
       });
        res.send(player_det_filtered);
    }catch (error){
        next(error);
    }
    });
router.get("/basicInfoByPosition/:playerName/:positionName", async(req, res, next) =>{
    try{
        const player_det = await players_utils.getPlayerbasicDetailsByPosition(req.params.playerName, req.params.positionName);
        var player_det_filtered = player_det.filter(function(x) {
            return x !== undefined;
       });
        res.send(player_det_filtered);
    }catch (error){
        next(error);
    }
    });    
module.exports = router;