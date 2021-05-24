CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[username] [varchar](8) NOT NULL UNIQUE,
    [first_name] [varchar](30) NOT NULL, 
    [last_name] [varchar](30) NOT NULL,
    [country] [varchar](30) NOT NULL,
	[password] [varchar](10) NOT NULL,
    [email] [varchar](30) NOT NULL,
    [img] [varchar](30)  NOT NULL
)