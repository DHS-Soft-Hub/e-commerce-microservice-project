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
        var completedTcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
        var rabbitHost = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        var shipmentIds = new System.Collections.Concurrent.ConcurrentDictionary<Guid, string>();

        var bus = MassTransit.Bus.Factory.CreateUsingRabbitMq(cfg =>
        {
            cfg.Host(rabbitHost, "/", h =>
            {
                h.Username("guest");
                h.Password("guest");
            });

            // Use default URN-based entity names to match Orders.Api

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
                    var shipmentId = $"SHP-{ctx.Message.OrderId:N}";
                    shipmentIds[ctx.Message.OrderId] = shipmentId;
                    Console.WriteLine($"[E2E] shipping-e2e-stub received CreateShipmentCommand for {ctx.Message.OrderId}, publishing ShipmentCreated with {shipmentId}");

                    await ctx.Publish(new ShipmentCreatedIntegrationEvent(
                        ctx.Message.OrderId,
                        shipmentId,
                        "Created",
                        DateTime.UtcNow
                    ));

                    // Ensure the saga has transitioned to Shipped before delivering
                    await Task.Delay(2000);
                    Console.WriteLine($"[E2E] shipping-e2e-stub publishing OrderDelivered for {ctx.Message.OrderId}");
                    await ctx.Publish(new OrderDeliveredIntegrationEvent(
                        ctx.Message.OrderId,
                        shipmentId,
                        DateTime.UtcNow
                    ));

                    // Also send to kebab-case exchange if API uses kebab entity formatter
                    try
                    {
                        var delivered = new OrderDeliveredIntegrationEvent(
                            ctx.Message.OrderId,
                            shipmentId,
                            DateTime.UtcNow
                        );
                        var kebabExchange = "orders-application-events-integration-order-order-delivered-integration-event";
                        var ep = await ctx.GetSendEndpoint(new Uri($"exchange:{kebabExchange}"));
                        await ep.Send(delivered);
                    }
                    catch { /* ignore */ }
                });
            });

            // Listener for OrderStatusChangedIntegrationEvent (bind to URN + kebab exchanges)
            cfg.ReceiveEndpoint("orders-e2e-listener", e =>
            {
                e.ConfigureConsumeTopology = false;
                e.Bind("urn:message:Orders.Application.Events.Integration.Order:OrderStatusChangedIntegrationEvent");
                e.Bind("orders-application-events-integration-order-order-status-changed-integration-event");

                e.Handler<OrderStatusChangedIntegrationEvent>(ctx =>
                {
                    Console.WriteLine($"[E2E] orders-e2e-listener received OrderStatusChanged: {ctx.Message.Status} for {ctx.Message.OrderId}");
                    if (ctx.Message.Status == "Completed")
                    {
                        completedTcs.TrySetResult(true);
                    }
                    return Task.CompletedTask;
                });
            });
        });

        await bus.StartAsync();
        Console.WriteLine($"E2E Test Bus Address: {bus.Address}");
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

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
            Assert.True(await Task.WhenAny(completedTcs.Task, Task.Delay(-1, cts.Token)) == completedTcs.Task,
                "Order did not reach Completed status in time");
        }
        finally
        {
            await bus.StopAsync();
        }
    }
}