const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
  //this function get list of teams id and call extract to get all teams data
  async function getTeamsInfo(teams_ids_list) {
    let promises = [];
    teams_ids_list.map((id) =>
      promises.push(
        axios.get(`${api_domain}/teams/${id}`, {
          params: {
            api_token: process.env.api_token,
            include: "country",
          },
        })
      )
    );
    let teams_info = await Promise.all(promises);
    return extractRelevantTeamData(teams_info);
  }
  //this function get list of teams and extract relevant info
  function extractRelevantTeamData(teams_info) {
    return teams_info.map((team_info) => {
      const { id, name , short_code, logo_path } = team_info.data.data;
      return {
        id: id,
        name: name,
        short_name: short_code,
        // image: logo_path,
        //country: name,  
      };
    });
  }
  //this function get team name and return name and image 
  async function getTeambasicDetailsByName(team_name){
    const all_team_with_same_name = await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
        include: "league", 
        },
      })
      return all_team_with_same_name.data.data.map((team_info) =>{
        if(team_info != undefined)
        {
          const {  name , logo_path } = team_info;
          const {id} = team_info.league.data
          if(id == 271){
          return{
            id: team_info.id,
            name: name,
            image: logo_path,
            }; 
          }
        }
      })
    }
  //this function get team id and return image and name of team  
  async function getTeambasicDetailsByID(team_ID){
    const team_info = await axios.get(`${api_domain}/teams/${team_ID}`, {
      params: {
        api_token: process.env.api_token,
        include: "league, coach", 
        },
      })
        const { name , logo_path } = team_info.data.data;
        const {id} = team_info.data.data.league.data
        if(id == 271){
          return {
            // id: team_info.data.data.id,
            id: team_ID,
            name: name,
            image: logo_path,
            coach : team_info.data.data.coach.data.fullname,
              
          };
        }
    }
  
  exports.getTeamsInfo = getTeamsInfo;
  exports.getTeambasicDetailsByName = getTeambasicDetailsByName;
  exports.getTeambasicDetailsByID = getTeambasicDetailsByID;