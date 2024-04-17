// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.

// builder.Services.AddControllers();
// // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();

// app.MapControllers();

// app.Run();

//New code for program.cs

using System.Text;
using chatBackendAPI.Contracts;
using chatBackendAPI.Data;
using chatBackendAPI.HubConfig;
using chatBackendAPI.Models;
using chatBackendAPI.Repositories;
using chatBackendAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;

var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped<IMessageService, MessageService>();
services.AddScoped<IMessageServiceQuery, MessageServiceQuery>();

services.Configure<ApplicationSettings>(configuration.GetSection("ApplicationSettings"));
services.AddDbContext<ChatDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("ChatConnectionString")));

services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<ChatDbContext>();

services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 4;
});

services.AddCors();

//Jwt Authentication
var key = Encoding.UTF8.GetBytes(configuration["ApplicationSettings:JWT_Secret"]);

services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

services.AddSignalR();

services.AddControllers();

services.AddOptions();

services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("v1/swagger.json", "Simple Chat API V1"); });

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(builder =>
    builder.WithOrigins(configuration["ApplicationSettings:Client_URL"], "http://localhost:4500")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chathub", options =>
{
    options.Transports =
        HttpTransportType.WebSockets |
        HttpTransportType.LongPolling;
});

app.Run();
