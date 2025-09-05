using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Shared.Infrastructure.Messaging
{
    public static class MassTransitConfiguration
    {
        public static IServiceCollection AddMassTransitWithRabbitMq(
            this IServiceCollection services, 
            IConfiguration configuration,
            Assembly? consumerAssembly = null,
            params Action<IBusRegistrationConfigurator>[] configurators)
        {
            services.AddMassTransit(x =>
            {
                // Add consumers from the specified assembly
                if (consumerAssembly != null)
                {
                    x.AddConsumers(consumerAssembly);
                }

                // Apply all configuration actions
                foreach (var configurator in configurators)
                {
                    configurator?.Invoke(x);
                }

                x.SetKebabCaseEndpointNameFormatter();

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(configuration.GetConnectionString("RabbitMQ"));
                    cfg.ConfigureEndpoints(context);
                });
            });

            // Register message publisher
            services.AddScoped<IMessagePublisher, MessagePublisher>();

            return services;
        }
    }
}