using System.Text;
using Auth.Api.Data.Context;
using Auth.Api.Entities;
using Auth.Api.Mappings;
using Auth.Api.Options;
using Auth.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
{
    // Add Controllers
    builder.Services.AddControllers();

    // Swagger (add explorer for minimal hosting)
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // CORS policy
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAllOrigins", policy =>
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
    });

    // Register DbContext
    builder.Services.AddDbContext<AuthDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("postgresdb")));

    // Register Identity (IMPORTANT!)
    builder.Services.AddIdentity<AuthUser, IdentityRole>()
        .AddEntityFrameworkStores<AuthDbContext>()
        .AddSignInManager()
        .AddDefaultTokenProviders();

    // Authentication / JWT
    var jwtKey = builder.Configuration["Jwt:Key"]
                 ?? throw new InvalidOperationException("Jwt:Key is missing from configuration");
    builder.Services
        .AddAuthentication(options =>
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
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

    // App services
    builder.Services
        .AddScoped<IAuthService, AuthService>()
        .AddSingleton<ITokenService, TokenService>()
        .AddMappings()
        .Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"))
        .AddScoped<IRefreshTokenStore, RefreshTokenStore>()
        .AddSingleton(resolver =>
                resolver.GetRequiredService<IOptions<JwtOptions>>().Value);
}

var app = builder.Build();
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        // Ensure DB is created and apply migrations
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        dbContext.Database.Migrate();
    }

    app.UseHttpsRedirection();

    app.UseRouting();              // explicit routing stage
    app.UseCors("AllowAllOrigins");// CORS after routing, before auth
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
}

app.Run();