using Microsoft.EntityFrameworkCore;
using ShoppingCart.Api.Data.Contexts;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Services;
using Shared.Infrastructure.Messaging;
using Microsoft.Extensions.Caching.Distributed;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<ShoppingCartDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("postgresdb")));

// Add distributed cache (required by CartRepository)
// builder.Services.AddStackExchangeRedisCache(options =>
// {
//     options.Configuration = builder.Configuration.GetConnectionString("redis");
// });
// Alternative: Use in-memory cache for development
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IDistributedCache, MemoryDistributedCache>();

// Add session support (required by CartSessionService)
builder.Services.AddDistributedMemoryCache(); // For session storage
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add MediatR (required by CartController)
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
});

// Register repositories and services
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartSessionService, CartSessionService>();

// Host gRPC
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();

// Add shared MassTransit configuration for events
builder.Services.AddMassTransitWithRabbitMq(
    builder.Configuration,
    System.Reflection.Assembly.GetExecutingAssembly()
);

var app = builder.Build();

// Configure pipeline
app.UseSession(); // Enable session middleware

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ShoppingCartDbContext>();
    await context.Database.MigrateAsync();

    app.MapGrpcReflectionService();
}

// Map gRPC service
app.MapGrpcService<ShoppingCartGrpcService>();

app.MapControllers();
app.Run();