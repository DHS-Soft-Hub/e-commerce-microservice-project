using System.Text;
using ApiGateway.Queries;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
var config = builder.Configuration;

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

// Add Authentication and JWT Bearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? string.Empty))
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            // Add any additional token validation logic here
            // For example, checking custom claims or roles
            Console.WriteLine("validated");
        },
        OnAuthenticationFailed = async context =>
        {
            // Add logging or custom handling for authentication failures
            Console.WriteLine(context.Exception);
        }
    };

    // Save the token after validation for forwarding
    options.SaveToken = true;
});

// Define Authorization Policy for secured endpoints
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AuthenticatedUsers", policy =>
        policy.RequireAuthenticatedUser());
});

// Add Reverse Proxy (YARP) with custom configuration
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(transforms =>
    {
       // Ensure the Authorization header is forwarded
       transforms.AddRequestTransform(async context =>
       {
           if (context.HttpContext.User.Identity?.IsAuthenticated ?? false)
           {
               var token = await context.HttpContext.GetTokenAsync("access_token");
               if (!string.IsNullOrEmpty(token))
               {
                   context.ProxyRequest.Headers.Authorization = 
                       new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
               }
           }
       });
    });

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

// Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Configure the reverse proxy
app.MapReverseProxy();

// Map GraphQL endpoint
app.MapGraphQL();

app.Run();