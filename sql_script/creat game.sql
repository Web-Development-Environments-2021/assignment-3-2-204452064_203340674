CREATE TABLE [dbo].[games](
	[game_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[date] [DATE] NOT NULL,
    [time] [TIME] NOT NULL, 
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
	[field_name] [varchar](100) NOT NULL,
    [goal_home] [int] ,
    [goal_away] [int] ,
    [referee] [varchar](30) NOT NULL
)