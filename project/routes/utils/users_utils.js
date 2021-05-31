const DButils = require("./DButils");
/*async function for adding to favorites and for get favorites to specific user id
tables: 1- favorites player 2- favorites game 3- favorites team*/
async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into users_favorites_players values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from users_favorites_players where user_id='${user_id}'`
  );
  return player_ids;
}
async function markGameAsFavorite(user_id, game_id) {
  await DButils.execQuery(
    `insert into users_favorites_games values ('${user_id}',${game_id})`
  );
}

async function getFavoriteGame(user_id) {
  const game_ids = await DButils.execQuery(
    `select game_id from users_favorites_games where user_id='${user_id}'`
  );
  return game_ids;
}

async function markTeamAsFavorite(user_id, team_id) {
  // try{
  await DButils.execQuery(
    `insert into users_favorites_teams values ('${user_id}',${team_id})`
  );
// }
  // catch(error){ 
  //   next(error);

  // }
}

async function getFavoriteTeam(user_id) {
  const team_ids = await DButils.execQuery(
    `select team_id from users_favorites_teams where user_id='${user_id}'`
  );
  return team_ids;
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGame = getFavoriteGame;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeam = getFavoriteTeam;