const axios = require("axios");
const DButils = require("./DButils");

//get info of all future game in the list, 
async function getfutureGameInfo(game_id_list){
    
    let list_game_info=[];
    let today = new Date();
    for (var i=0; i< game_id_list.length; i++){
        let game = await getSpicificGameInfo(game_id_list[i]);
        if(game.date > today)
        {
            game.date = game.date.toISOString().replace(/T/, ' ').slice(0,10);
            game.time = game.time.toISOString().replace(/\..+/, '').slice(11,20);
            list_game_info.push(game);
        }
    }
    // game_id_list.map((game_id)=>
    // list_game_info.push(await getGameInfo(game_id)
    //   ));
    if(list_game_info.length<1){
        throw{status:409, message:"your favorites games is empty"}
    }
    return list_game_info;
}

//get info of specific game 
async function getSpicificGameInfo(game_id){
    const gamedet = await DButils.execQuery(
        `select game_id, date, time, home_team_name, away_team_name, field_name, referee from games where game_id='${game_id}'`
    );
    return gamedet[0];
}



// return all the game, past and future
async function getAllGame(){
    let allGameToReturn = {}
    let futureGames = []
    let pastGames = []
    const gameDet = await GameFromDB();
    const eventsForGames=  await getAllEvents();
    for (var i=0; i< gameDet.length; i++){
        if(gameDet[i].goal_home != null){
            let gameEvents = await getAllEventForGame(eventsForGames, gameDet[i].game_id);
            gameDet[i].eventsSchedule = gameEvents;
            pastGames.push(gameDet[i]);
        }
        else{
            futureGames.push(gameDet[i]);    
    }}
    allGameToReturn.pastGames = pastGames;
    allGameToReturn.futureGames = futureGames;  
    return allGameToReturn;
}

async function GameFromDB(){
    const gameDet = await DButils.execQuery(
        `select game_id, date, time, home_team_name, away_team_name, field_name, goal_home, goal_away, referee from games`
    );
    return gameDet;
}

async function getAllEvents(){
    const eventsForGames=  await DButils.execQuery(
        `select event_id, game_id, date, time, minute, event_name, player_id_1, player_id_2 from games_events`
    );
    return eventsForGames;
}

// return all the events for spicific game
async function getAllEventForGame(events, gameId){
    let eventsGame=[]
    for (var i=0; i< events.length; i++){
        if(events[i].game_id === gameId){
            delete events[i].game_id;
            eventsGame.push(events[i])
        }
    }
    // if (events.find((x) => x.game_id === gameId)){
    //     console.log(x) 
    // }
    return eventsGame     
}
//this function get team name and extract relevants info of games
async function getAllgameByGroupSortPastFuture(team_name){
    const allGamesByTeam = await getAllGameFromDbByTeam(team_name);
    return splitPastFutureGame(allGamesByTeam);
}
//this function get team name and return all games from db
async function getAllGameFromDbByTeam(team_name){
    const allGames = await DButils.execQuery(
        `select * from games where home_team_name ='${team_name}' or away_team_name = '${team_name}'` 
    );
    return allGames;

}

//this function get games and split by date between past and future
async function splitPastFutureGame(allGames){
    let pastGames = [];
    let futureGames = [];
    let today = new Date();
    const eventsForGames=  await getAllEvents();
    for (let i = 0; i < allGames.length; i++){
        if (allGames[i].date > today){
            futureGames.push(allGames[i])
        }
        else{
            //const eventsForGames = await getAllEventsByGameID(allGames[i].game_id);
            let gameEvents = await getAllEventForGame(eventsForGames,allGames[i].game_id);
            allGames[i].eventsSchedule = gameEvents;
            pastGames.push(allGames[i])
        }
        
    }
    return [pastGames, futureGames]

}
//this function extract every event by specific game from DB
// async function getAllEventsByGameID(game_id){
//     const eventsForGame=  await DButils.execQuery(`select game_id, date, time, minute, event_name from games_events where game_id='${game_id}'`    
//     );
//     return eventsForGame;
// }


async function getRefereesNames(){
    const all_referee = await DButils.execQuery(
        `select referee_name from referee`
    );
    if(all_referee.length>0){
    let referees = []
    for (var i = 0; i<all_referee.length; i++){
        referees[i] = all_referee[i]["referee_name"]
    }
    return referees;}
}
//get all fields in db
async function getFieldsNames(){
    const all_fields = await DButils.execQuery(`select field_name from fields`);
    let fields = []
    for (var i = 0; i<all_fields.length; i++){
        fields[i] = all_fields[i]["field_name"]
    }
    return fields;
}
//this function check if game date is free for two teams return message
async function checkIfTeamsFree(allGames, gameDate, home, away){
    if (allGames.find((game_info)=>game_info.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === gameDate && 
    (game_info.home_team_name === home || game_info.away_team_name === home)))
        {return "home team has a game in this date"; }
    if(allGames.find((game_info)=>game_info.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === gameDate &&
    (game_info.home_team_name === away || game_info.away_team_name === away)))  
        {return "away team has a game in this date";}  
    else
        {return null;}    
}
async function checkIfFieldFree(allGames, gameDate, field){
    if (allGames.find((game_info) => game_info.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === gameDate && 
  (game_info.field_name === field)))
      { //return "this field is not free";
        throw{status:409, message: "this field is not free"}}
    else{return null}

}

async function checkIfRefereeFree(allGames, gameDate, referee){
    if (allGames.find((game_info) => game_info.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === gameDate && 
  (game_info.referee === referee)))
      { 
        throw{status:409, message: "referee is not free"}}
    else{return null}

}

async function insertNewGame(game_info){
    const gameDate = game_info.date;
    let today = new Date().toISOString().replace(/T/, ' ').slice(0,10);
    if (gameDate < today){
        //return "you must insert a update date"
        throw{status:409, message:"you must insert a update date" }
    }
    const allGames = await GameFromDB();
    const messTeam = await checkIfTeamsFree(allGames, gameDate, game_info.home_team_name, game_info.away_team_name);     
    const messField = await checkIfFieldFree(allGames, gameDate, game_info.field_name);
    const messReferee = await checkIfRefereeFree(allGames, gameDate, game_info.referee)
    if (messTeam != null){
        //return messTeam
        throw{status:409, message: messTeam}
    }
    if (messField != null){
        //return messField
        throw{status:409, message: messField}
    }
    else{
        insertNewGameToDB(game_info);
        return "game created"
    }
}
async function insertNewGameToDB(game_info){
    await DButils.execQuery(
        `INSERT INTO dbo.games (date, time, home_team_name, away_team_name, field_name, referee) VALUES ('${game_info.date}', '${game_info.time}', '${game_info.home_team_name}'
        , '${game_info.away_team_name}', '${game_info.field_name}', '${game_info.referee}')`
      );
}

exports.getfutureGameInfo= getfutureGameInfo;
exports.getAllGame=getAllGame;
exports.getAllgameByGroupSortPastFuture = getAllgameByGroupSortPastFuture;
exports.insertNewGame = insertNewGame;
exports.getRefereesNames=getRefereesNames;
exports.getFieldsNames=getFieldsNames;