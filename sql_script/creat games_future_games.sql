CREATE TABLE [dbo].[games_future_games](
	[game_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[date] [DATE] NOT NULL,
    [time] [TIME] NOT NULL, 
    [home_team_name] [varchar](30) NOT NULL,
    [away_team_name] [varchar](30) NOT NULL,
	[field_name] [varchar](100) NOT NULL,
)