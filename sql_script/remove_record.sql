IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[games]') AND type in (N'U'))
DELETE  [dbo].[games] WHERE home_team_name='Macabi'
GO

DELETE 
  FROM [dbo].[users_favorites_players] WHERE user_id='1' AND  player_id='37524947'
  Go