const axios = require("axios");
const DButils = require("./DButils");

//get info of all future game in the list, 
async function getfutureGameInfo(game_id_list){
    let list_game_info=[];
    for (var i=0; i< game_id_list.length; i++){
        let game = await getSpicificGameInfo(game_id_list[i]);
        list_game_info.push(game);
    }
    // game_id_list.map((game_id)=>
    // list_game_info.push(await getGameInfo(game_id)
    //   ));
    return list_game_info;
}

//get info of specific game 
async function getSpicificGameInfo(game_id){
    const gamedet = await DButils.execQuery(
        `select date, time, home_team_name, away_team_name, field_name, referee from games where game_id='${game_id}'`
    );
    return gamedet;
}

async function getAllGame(){
    // const games = await DButils.execQuery(`select games.date, games.time, games.home_team_name, games.away_team_name, games.field_name, 
    // games.goal_home, games.goal_away, games.referee, games_events.date, games_events.time, games_events.minute, games_events.event_name from games, games_events
    // where games.game_id=games_events.game_id
    // group by games.game_id`)
    let allDataToReturn = []
    const gameDet = await DButils.execQuery(
        `select game_id, date, time, home_team_name, away_team_name, field_name, goal_home, goal_away, referee from games`
    );

    const eventsForGames=  await DButils.execQuery(
        `select game_id, date, time, minute, event_name from games_events`
    );
    for (var i=0; i< gameDet.length; i++){
        // let fullGame = []
        if(gameDet[i].goal_home != null){
            let gameEvents= getAllEventForGame(eventsForGames, gameDet[i].game_id);
            gameDet[i].eventsSchedule = gameEvents;
            allDataToReturn.push(gameDet[i])
    }}
    return allDataToReturn;
}

function getAllEventForGame(events, gameId){
    let eventsGame=[]
    if (events.find((x) => x.game_id === gameId))
        eventsGame.push(x)
    return eventsGame
        
}


exports.getfutureGameInfo= getfutureGameInfo;
exports.getAllGame=getAllGame