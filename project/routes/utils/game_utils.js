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

// return all the game, past and future
async function getAllGame(){
    let allDataToReturn = []
    const gameDet = await GameFromDB();
    const eventsForGames=  await getAllEvents();
    for (var i=0; i< gameDet.length; i++){
        // let fullGame = []
        if(gameDet[i].goal_home != null){
            let gameEvents= await getAllEventForGame(eventsForGames, gameDet[i].game_id);
            gameDet[i].eventsSchedule = gameEvents;
            allDataToReturn.push(gameDet[i]);
        }
        else{
            allDataToReturn.push(gameDet[i]);    
    }}
    return allDataToReturn;
}

async function GameFromDB(){
    const gameDet = await DButils.execQuery(
        `select game_id, date, time, home_team_name, away_team_name, field_name, goal_home, goal_away, referee from games`
    );
    return gameDet;
}

async function getAllEvents(){
    const eventsForGames=  await DButils.execQuery(
        `select game_id, date, time, minute, event_name from games_events`
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
//this function get team name and extract from db all games of this team
async function getAllgameByGroupSortPastFuture(team_name){
    const allGames = await DButils.execQuery(
        `select * from games where home_team_name ='${team_name}' or away_team_name = '${team_name}'` 
    );
    return(splitPastFutureGame(allGames));
}

//this function get games and split by date between past and future
function splitPastFutureGame(allGames){
    let pastGames = [];
    let futureGames = [];
    let today = new Date();
    for (let i = 0; i < allGames.length; i++){
        if (allGames[i].date > today){
            futureGames.push(allGames[i])
        }
        else{
            allEvents = getAllEventsByGameID(allGames[i].game_id);
            allGames[i].events = getAllEventForGame(allEvents,allGames[i].game_id)
            pastGames.push(allGames[i])
        }
    }
    return [pastGames, futureGames]

}
//this function extract every event by specific game from DB
async function getAllEventsByGameID(game_id){
    const eventsForGame=  await DButils.execQuery(`select game_id, date, time, minute, event_name from games_events where game_id='${game_id}'`    
    );
    return eventsForGame;
}

async function getRefereesNames(){
    const all_referee = await DButils.execQuery(
        `select referee_name from referee`
    );
    return all_referee;
}

exports.getfutureGameInfo= getfutureGameInfo;
exports.getAllGame=getAllGame;

exports.getAllgameByGroupSortPastFuture = getAllgameByGroupSortPastFuture;

exports.getRefereesNames=getRefereesNames;

