const DButils = require("./DButils");
/*async function for adding to favorites and for get favorites to specific user id
tables: 1- favorites player 2- favorites game 3- favorites team*/
async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into users_favorites_players values ('${user_id}',${player_id})`
  );
}
//return all favourite players of specific user
async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from users_favorites_players where user_id='${user_id}'`
  );
  return player_ids;
}
//post - fav games check update date and if not exist already
async function markGameAsFavorite(user_id, game_id) {
  const game_date_in_future = await checkGameDateInFuture(game_id);
  const gameNotInFav = await GameNotExistInFav(user_id, game_id);
  if(game_date_in_future){
    if(gameNotInFav){
      await DButils.execQuery(
    `insert into users_favorites_games values ('${user_id}',${game_id})`);
    return;
    
        
    }
    throw{status:400, message:"this game id is already exist in your favorites list" }
    
    
  }
  throw{status:400, message:"date must be a future date" }
  
  
}
//return all favourite games of specific user
async function getFavoriteGame(user_id) {
  const game_ids = await DButils.execQuery(
    `select game_id from users_favorites_games where user_id='${user_id}'`
  );
  return game_ids;
}
//add team to favo teams of specific user
async function markTeamAsFavorite(user_id, team_id) {
  // try{
  await DButils.execQuery(
    `insert into users_favorites_teams values ('${user_id}',${team_id})`
  );
}
//return all teams fav of a user
async function getFavoriteTeam(user_id) {
  const team_ids = await DButils.execQuery(
    `select team_id from users_favorites_teams where user_id='${user_id}'`
  );
  return team_ids;
}

async function checkGameDateInFuture(game_id){
  // get the date of game 
  const game_date = await DButils.execQuery( `select date from games where game_id ='${game_id}'`)
  let today = new Date().toISOString().replace(/T/, ' ').slice(0,10);
  const game_date_tocompre = game_date[0].date.toISOString().replace(/T/, ' ').slice(0,10);
  if (game_date_tocompre < today){ // date not update
    return false;
  }
  return true;
}
//this function check if game id not exist in user favorites games
async function GameNotExistInFav(user_id, game_id){
  const allFav = await getFavoriteGame(user_id);
  for (let fav = 0; fav < allFav.length; fav++) {
    if(allFav[fav].game_id == game_id){
      return false;
    }
  }
  return true;
}

async function deletePastGameFromFavoriteTable(favorite_game){

  if (favorite_game.length ===0){
    throw { status: 444, message: "no favorite games" };
  }
  let today = new Date();
  let id_favorite =[]
  favorite_game.map((element) => id_favorite.push(element.game_id));
  let Games_to_check_date = await getGameFavoriteForUser(id_favorite);
  let Game_to_delete = []
  for (var i=0; i< Games_to_check_date.length; i++){
    // let game = await getGameFavoriteForUser(favorite_game[i].game_id) 
    // if(game[0].date < today)
    if(Games_to_check_date[i].date < today)
    {
      Game_to_delete.push(Games_to_check_date[i].game_id);  
    }
  }
  await deleteFromDB(Game_to_delete);
}
async function getGameFavoriteForUser(favorite_game){
  //let id_favorite_game = favorite_game.map(function (a) {return "'" + a.replace("'", "''") + "'";}).join(",");
//   const games = await DButils.execQuery(
//     `select game_id, date from games where game_id='${favorite_game}'`
// );
  const games = await DButils.execQuery(
      `select game_id, date from games where game_id in (${favorite_game})`
  );
  return games;
}

async function deleteFromDB(game_del){
  if (game_del.length===0){
    throw { status: 444, message: "no favorite games to delete" };
  }
  await DButils.execQuery(
    `delete from users_favorites_games where game_id in (${game_del})`
  );
  //   await DButils.execQuery(
  //   `delete from users_favorites_games where game_id in ('${game_del}')`
  // );
  
} 

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGame = getFavoriteGame;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeam = getFavoriteTeam;
exports.deletePastGameFromFavoriteTable= deletePastGameFromFavoriteTable;