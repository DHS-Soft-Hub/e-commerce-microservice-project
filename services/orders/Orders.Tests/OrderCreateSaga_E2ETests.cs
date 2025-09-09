using System;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Orders.Application.Messaging.Contracts;
using Orders.Application.Events.Integration.Inventory;
using Orders.Application.Events.Integration.Payment;
using Orders.Application.Events.Integration.Shipment;
using Orders.Application.Events.Integration.Order;

public class OrderCreateSaga_E2ETests
{
    [Fact]
    public async Task OrderSaga_Completes_EndToEnd_With_RabbitMq()
    {
        // Assumes RabbitMQ + Orders.Api are running (docker-compose)
    var completedTcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
        var services = new ServiceCollection();
        services.AddMassTransit(x =>
        {
            x.UsingRabbitMq((ctx, cfg) =>
            {
                cfg.Host(Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost", "/", h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });

                // Stub external services as consumers in test process
                cfg.ReceiveEndpoint("inventory-e2e-stub", e =>
                {
                    e.Handler<ReserveInventoryCommand>(async ctx =>
                    {
                        await ctx.Publish(new InventoryReservedIntegrationEvent(
                            ctx.Message.OrderId,
                            $"RSV-{ctx.Message.OrderId:N}",
                            "Reserved",
                            DateTime.UtcNow
                        ));
                    });
                    e.Handler<ReleaseInventoryCommand>(ctx => Task.CompletedTask);
                });

                cfg.ReceiveEndpoint("payment-e2e-stub", e =>
                {
                    e.Handler<ProcessPaymentCommand>(async ctx =>
                    {
                        await ctx.Publish(new PaymentProcessedIntegrationEvent(
                            ctx.Message.OrderId,
                            NewId.NextGuid(),
                            ctx.Message.Amount,
                            ctx.Message.Currency,
                            ctx.Message.PaymentMethod,
                            "Processed",
                            DateTime.UtcNow
                        ));
                    });
                    e.Handler<RefundPaymentCommand>(ctx => Task.CompletedTask);
                });

                cfg.ReceiveEndpoint("shipping-e2e-stub", e =>
                {
                    e.Handler<CreateShipmentCommand>(async ctx =>
                    {
                        await ctx.Publish(new ShipmentCreatedIntegrationEvent(
                            ctx.Message.OrderId,
                            $"SHP-{ctx.Message.OrderId:N}",
                            "Created",
                            DateTime.UtcNow
                        ));

                        // Simulate delivery after shipment creation
                        await ctx.Publish(new OrderDeliveredIntegrationEvent(
                            ctx.Message.OrderId,
                            $"SHP-{ctx.Message.OrderId:N}",
                            DateTime.UtcNow
                        ));
                    });
                });

                // Explicit listener for OrderStatusChangedIntegrationEvent
                cfg.ReceiveEndpoint("orders-e2e-listener", e =>
                {
                    e.Handler<OrderStatusChangedIntegrationEvent>(ctx =>
                    {
                        if (ctx.Message.Status == "Completed")
                            completedTcs.TrySetResult(true);
                        return Task.CompletedTask;
                    });
                });
            });
        });

        var provider = services.BuildServiceProvider(true);
        var bus = provider.GetRequiredService<IBusControl>();
        await bus.StartAsync();
        try
        {
            var orderId = NewId.NextGuid();
            var customerId = NewId.NextGuid();

            // Kick off saga by publishing the OrderCreated event
            await bus.Publish(new Orders.Application.Events.Integration.Order.OrderCreatedIntegrationEvent(
                orderId,
                customerId,
                149.99m,
                "USD",
                new()
            ));

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
            Assert.True(await Task.WhenAny(completedTcs.Task, Task.Delay(-1, cts.Token)) == completedTcs.Task,
                "Order did not reach Completed status in time");
        }
        finally
        {
            await bus.StopAsync();
            await provider.DisposeAsync();
        }
    }
}