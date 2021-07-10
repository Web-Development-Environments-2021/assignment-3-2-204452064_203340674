IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[games]') AND type in (N'U'))
UPDATE  [dbo].[games] SET referee ='james child' WHERE game_id = 27
GO