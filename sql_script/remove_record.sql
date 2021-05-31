IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[games]') AND type in (N'U'))
DELETE  [dbo].[games] WHERE home_team_name='Macabi'
GO