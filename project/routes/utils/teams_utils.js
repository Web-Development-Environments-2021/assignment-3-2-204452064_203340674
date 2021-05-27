const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getCoach(team_id) {
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    });
    const { fullname } = team.data.data.coach.data;
    return fullname;
  }
  
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
  function extractRelevantTeamData(teams_info) {
    return teams_info.map((team_info) => {
      const { name , short_code } = team_info.data.data;
      
      //const { name } = team_info.data.data.country.data;
      return {
        name: name,
        short_name: short_code,
        //country: name,  
      };
    });
  }
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
          const { name , logo_path } = team_info;
          const {id} = team_info.league.data
          if(id == 271){
          return{
            name: name,
            image: logo_path,

            }; 
          }
        }
      })
    }


  exports.getCoach = getCoach;
  exports.getTeamsInfo = getTeamsInfo;
  exports.getTeambasicDetailsByName = getTeambasicDetailsByName;