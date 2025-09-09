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
using Shared.Contracts.Orders.Commands;

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

        // Option B: Isolated E2E wiring
        // When USE_E2E_STUBS=true, route command messages to the E2E stub queues
        // that are hosted by the test process (inventory/payment/shipping -e2e-stub).
        // This ensures the running Orders.Api uses the test stubs during E2E.
        var useE2EStubs = configuration.GetValue<bool>("USE_E2E_STUBS");
        if (useE2EStubs)
        {
            EndpointConvention.Map<ReserveInventoryCommand>(new Uri("queue:inventory-e2e-stub"));
            EndpointConvention.Map<ReleaseInventoryCommand>(new Uri("queue:inventory-e2e-stub"));
            EndpointConvention.Map<ProcessPaymentCommand>(new Uri("queue:payment-e2e-stub"));
            EndpointConvention.Map<RefundPaymentCommand>(new Uri("queue:payment-e2e-stub"));
            EndpointConvention.Map<CreateShipmentCommand>(new Uri("queue:shipping-e2e-stub"));
        }

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