using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Orders.Application.Services;
using Orders.Application.Sagas;
using Shared.Infrastructure.Messaging;
using Shared.Logging;
using System.Reflection;
using MassTransit;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(OrderService).Assembly);
        });

        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IMessagePublisher, MessagePublisher>();

        // Add Logging
        services.AddLoggingConfiguration();

        return services;
    }

    /// <summary>
    /// Add MassTransit messaging configuration for Orders Application
    /// This should be called from Infrastructure layer with DbContext configuration
    /// </summary>
    public static IServiceCollection AddOrdersMessaging(
        this IServiceCollection services,
        IConfiguration configuration,
        Action<IBusRegistrationConfigurator>? additionalConfiguration = null)
    {
        services.AddMassTransitWithRabbitMq(
            configuration,
            Assembly.GetExecutingAssembly(), // This assembly contains consumers and sagas
            x =>
            {
                // Add saga configuration
                x.AddSagaStateMachine<OrderCreateSaga, OrderCreateSagaStateData>();
                
                // Apply additional configuration (like EF repository setup)
                additionalConfiguration?.Invoke(x);
            });

        return services;
    }
}