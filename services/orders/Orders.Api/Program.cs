using Orders.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddApplicationServices()
                .AddInfrastructure(builder.Configuration);

// Host gRPC
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Enable migrations
    await app.UseMigrationsAsync();

    app.MapGrpcReflectionService();
}

// Map gRPC service
app.MapGrpcService<OrdersGrpcService>();

app.MapControllers();

app.Run();
