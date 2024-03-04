using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using server.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var serverVersion = Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.34-mysql");
// Add services to the container.
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AacSargikDbContext>(optionsBuilder =>
optionsBuilder.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
serverVersion));

// Allowing all Origins to acces API for development
// Change in production environment for security reasons.
if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
    });
}


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => "Hello From AAC SARGIK!🫡");
app.MapControllers(); 

app.Run();

