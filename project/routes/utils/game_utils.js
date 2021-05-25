const axios = require("axios");
const DButils = require("./DButils");


async function getfutureGameInfo(game_id_list){
    let list_game_info=[];
    for (var i=0; i< game_id_list.length; i++){
        let game = await getGameInfo(game_id_list[i]);
        list_game_info.push(game);
    }
    // game_id_list.map((game_id)=>
    // list_game_info.push(await getGameInfo(game_id)
    //   ));
    return list_game_info;
}

async function getGameInfo(game_id){
    const gamedet = await DButils.execQuery(
        `select date, time, home_team_id, away_team_id, field_id from games_future_games where game_id='${game_id}'`
    );
    return gamedet;
}

exports.getfutureGameInfo= getfutureGameInfo;