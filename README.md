# Chatting Application
This is an online chat application with Angular, ASP.NET Core, SignalR and SqlServer. It has the following functionalities </br> 
 * As a new user one can resgister with his/her email address, first name and last name </br>
 * Registered user can login with his/her email address. </br>
 * LoggedIn user has dashboard and from where he can see list users and he can chat with any one from the list. Chat always happen between two users. </br>
 * User can see chat history.</br>
 * User can delete his chat history in one of two ways. He or she can delete chat data for himselft/herself or everyone.</br>
 * User can also delete all the chat histories whom he/she chat with.</br>
 * Application has the sign out functionality.</br></br>

## Technologies

* ASP.NET 6.0
* Entity Framework Core 6.0
* Angular 9
* Signal R
* Sql Server
* Bootstrap

## Development Environment Ready

1. Install Latest [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Install [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/)
3. Install SDK [.NET 6.0 or upper](https://dotnet.microsoft.com/en-us/download/dotnet)
4. Install the latest [Node.js LTS](https://nodejs.org/en/)
5. Run `npm install -g @angular/cli` to install latest version of angular CLI

## Run Back-End Application (.NET Web API)
1. First of all, run the database migrations in Nuget Package Manager Console in Visual Studio by 'Update-Database' command or if you use .NET Core CLI, then run 'dotnet ef database update'.
2. Build the project and run in Visual Studio. If in .NET Core CLI run 'dotnet build' and then 'dotnet run'.

## Run Front-End Application (Angular 9)

1. Navigate to the workspace folder, such as `simple-chat-ui`.
2. Open terminal window
3. Run `npm install` to install all dependencies used in application.
4. Run `yarn install` if there any problem with npm install.(you can download and install yarn from here (https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
5. Run `npm start` to run chat application in browser.
6. Browse `http://localhost:4500` to view chat app in browser

## Database Configuration

The Application uses data-store in SQL Server.

Update the **ChatConnectionString** connection string within **chatBackendAPI/appsettings.json** , so that application can point to a valid SQL Server instance. 

```json
  "ConnectionStrings": {
    "ChatConnectionString": "Server=.; Database=chatDB; Trusted_Connection=True; MultipleActiveResultSets=True;"
  },
```

When you run **update-database** command, the migrations will be applied and the database will be automatically created.

## Application Architecture

### Domain

This will contain all entities, enums, exceptions, interfaces, types and logic specific to the domain layer.

### Application

This layer contains all application logic. It is dependent on the domain layer, but has no dependencies on any other layer or project. This layer defines interfaces that are implemented by outside layers. For example, if the application need to access a message service, a new interface would be added to application and an implementation would be created within infrastructure.

### Front-End (Anuglar 9)

Front-end is a single page application based on angular 9. This only communicates with restfull api layer to store or retrieve data.
