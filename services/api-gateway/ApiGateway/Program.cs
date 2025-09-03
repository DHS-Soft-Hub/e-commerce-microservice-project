using ApiGateway.Queries;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services with specific origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>();

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

app.MapGraphQL();

app.Run();