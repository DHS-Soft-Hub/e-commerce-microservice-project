using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Orders.Domain.Repositories;
using Orders.Infrastructure.Persistence;
using Orders.Infrastructure.Repositories;
using Shared.Domain.Interfaces;
using Shared.Infrastructure.Messaging;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Orders.Infrastructure.Persistence.Interceptors;
using Orders.Application.Sagas;
using MassTransit;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Add db context
        services.AddDbContext<OrdersDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("postgresdb")));

        // Add shared MassTransit configuration
        services.AddMassTransitWithRabbitMq(
            configuration,
            Assembly.GetExecutingAssembly(),
            x =>
            {
                // Configure saga with Entity Framework repository
                x.AddSagaStateMachine<OrderCreateSaga, OrderCreateSagaStateData>()
                    .EntityFrameworkRepository(r =>
                    {
                        r.ConcurrencyMode = ConcurrencyMode.Optimistic;
                        r.ExistingDbContext<OrdersDbContext>();
                    });
            });

        // Add repositories
        services.AddScoped<PublishDomainEventsInterceptor>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
    
    // Extension method for WebApplication
    public static async Task<WebApplication> UseMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

        try
        {
            Console.WriteLine("Running OrdersService migrations...");
            await context.Database.MigrateAsync();
            Console.WriteLine("OrdersService migrations completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Migration failed: {ex.Message}");
            throw;
        }

        return app;
    }
}