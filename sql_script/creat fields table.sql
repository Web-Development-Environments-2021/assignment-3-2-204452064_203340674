CREATE TABLE [dbo].[fields](
	[field_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[field_name] [varchar](30) NOT NULL UNIQUE,
)