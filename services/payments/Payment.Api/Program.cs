using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Payment.Api.Data.Contexts;
using Payment.Api.Data.Repositories;
using Payment.Api.Data.Services.Implementations;
using Payment.Api.Data.Services.Interfaces;
using Shared.Infrastructure.Messaging;

var builder = WebApplication.CreateBuilder(args);
{
    var configuration = builder.Configuration;
    
    builder.Services.AddControllers();

    builder.Services.AddDbContext<PaymentDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("postgresdb")));

    // Register Services
    builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
    builder.Services.AddScoped<IPaymentService, PaymentService>();

    // Add shared MassTransit configuration
    builder.Services.AddMassTransitWithRabbitMq(
        configuration,
        Assembly.GetExecutingAssembly()
    );
}

var app = builder.Build();
{
    if (app.Environment.IsDevelopment())
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<PaymentDbContext>();
        await context.Database.MigrateAsync();
    }

    app.MapControllers();
}

app.Run();
