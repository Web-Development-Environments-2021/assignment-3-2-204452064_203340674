CREATE TABLE [dbo].[referee](
	[referee_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[referee_name] [varchar](30) NOT NULL UNIQUE,
)