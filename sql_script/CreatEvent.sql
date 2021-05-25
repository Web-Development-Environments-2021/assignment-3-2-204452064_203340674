CREATE TABLE [dbo].[games_events](
    [event_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [game_id] [int] NOT NULL,
    [date] [DATE] NOT NULL,
    [time][TIME] NOT NULL,
    [minute] [int] NOT NULL,
    [event_name] [varchar](300) NOT NULL
    )