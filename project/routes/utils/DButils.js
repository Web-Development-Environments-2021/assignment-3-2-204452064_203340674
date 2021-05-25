require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.tedious_userName,
  password: process.env.tedious_password,
  server: process.env.tedious_server,
  database: process.env.tedious_database,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

exports.execQuery = async function (query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};/* ---implement in Game.js---
async function check_date_for_teams(new_rec,dates_teams) {
  if (dates_teams.find((x) => 
  x.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0,10) === new_rec.date && 
  (x.home_team_id === new_rec.home_team_id || x.home_team_id === new_rec.away_team_id
    || x.away_team_id === new_rec.home_team_id || x.away_team_id === new_rec.away_team_id)))
      throw { status: 401, message: "one of the team have game in this date"};
}
exports.check_date_for_teams = check_date_for_teams;
*/

// process.on("SIGINT", function () {
//   if (pool) {
//     pool.close(() => console.log("connection pool closed"));
//   }
// });

// poolConnect.then(() => {
//   console.log("pool closed");

//   return sql.close();
// });

// exports.execQuery = function (query) {
//   return new Promise((resolve, reject) => {
//     sql
//       .connect(config)
//       .then((pool) => {
//         return pool.request().query(query);
//       })
//       .then((result) => {
//         // console.log(result);
//         sql.close();
//         resolve(result.recordsets[0]);
//       })
//       .catch((err) => {
//         // ... error checks
//       });
//   });
// };
