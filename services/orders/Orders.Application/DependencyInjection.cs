using Microsoft.Extensions.DependencyInjection;
using Orders.Application.Services;
using Shared.Infrastructure.Messaging;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(OrderService).Assembly);
        });

        services.AddScoped<OrderService, OrderService>();
        services.AddScoped<IMessagePublisher, MessagePublisher>();

        return services;
    }
}