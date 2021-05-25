CREATE TABLE [dbo].[users_favorites_players](
	[user_id] [int] NOT NULL,
	[player_id] [int] NOT NULL,
	PRIMARY KEY(user_id, player_id),
)