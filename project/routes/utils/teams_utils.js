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
      const team_name = name;
      const { name } = player_info.data.data.country.data;
      return {
        name: team_name,
        short_name: short_code,
        country: name,  
      };
    });
  }


  exports.getCoach = getCoach;
  exports.getTeamsInfo = getTeamsInfo;