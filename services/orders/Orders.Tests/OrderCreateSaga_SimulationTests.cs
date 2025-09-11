using System;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
using Microsoft.Extensions.DependencyInjection;
using Orders.Application.Sagas;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Inventory.Events;
using Shared.Contracts.Payments.Events;
using Shared.Contracts.Shipment.Events;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.Orders.Models;
using Xunit;

namespace Orders.Application.Tests
{
    public class OrderCreateSaga_SimulationTests
    {
        [Fact]
        public async Task OrderCreateSaga_Completes_Successfully_With_Stubs()
        {
            await using var provider = new ServiceCollection()
                .AddMassTransitTestHarness(cfg =>
                {
                    // Register saga with in-memory repository
                    cfg.AddSagaStateMachine<OrderCreateSaga, OrderCreateSagaStateData>()
                        .InMemoryRepository();

                    cfg.UsingInMemory((context, busCfg) =>
                    {
                        // Stub: Inventory endpoint
                        busCfg.ReceiveEndpoint("inventory", e =>
                        {
                            e.Handler<ReserveInventoryCommand>(async ctx =>
                            {
                                var reservationId = $"RSV-{ctx.Message.OrderId:N}";
                                await ctx.Publish(new InventoryReservedIntegrationEvent(
                                    ctx.Message.OrderId,
                                    reservationId,
                                    "InventoryReserved",
                                    DateTime.UtcNow
                                ));
                            });

                            e.Handler<ReleaseInventoryCommand>(async ctx =>
                            {
                                // No-op, acknowledge release
                                await Task.CompletedTask;
                            });
                        });

                        // Stub: Payment endpoint
                        busCfg.ReceiveEndpoint("payment", e =>
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

                            e.Handler<RefundPaymentCommand>(async ctx =>
                            {
                                // No-op, acknowledge refund
                                await Task.CompletedTask;
                            });
                        });

                        // Stub: Shipping endpoint
                        busCfg.ReceiveEndpoint("shipping", e =>
                        {
                            e.Handler<CreateShipmentCommand>(async ctx =>
                            {
                                var shipmentId = $"SHP-{ctx.Message.OrderId:N}";
                                await ctx.Publish(new ShipmentCreatedIntegrationEvent(
                                    ctx.Message.OrderId,
                                    shipmentId,
                                    "Created",
                                    DateTime.UtcNow
                                ));
                            });
                        });

                        // Map command types to stub endpoints so saga .Send() can resolve destinations
                        EndpointConvention.Map<ReserveInventoryCommand>(new Uri("queue:inventory"));
                        EndpointConvention.Map<ReleaseInventoryCommand>(new Uri("queue:inventory"));
                        EndpointConvention.Map<ProcessPaymentCommand>(new Uri("queue:payment"));
                        EndpointConvention.Map<RefundPaymentCommand>(new Uri("queue:payment"));
                        EndpointConvention.Map<CreateShipmentCommand>(new Uri("queue:shipping"));

                        // Create saga endpoint
                        busCfg.ConfigureEndpoints(context);
                    });
                })
                .BuildServiceProvider(true);

            var harness = provider.GetRequiredService<ITestHarness>();
            var sagaHarness = provider.GetRequiredService<ISagaStateMachineTestHarness<OrderCreateSaga, OrderCreateSagaStateData>>();

            await harness.Start();
            try
            {
                var orderId = NewId.NextGuid();
                var customerId = NewId.NextGuid();

                // Kick off the saga with a concrete event instance
                var items = new[]
                {
                    new OrderItemCheckedOutDto
                    {
                        ProductId = NewId.NextGuid(),
                        ProductName = "Demo Product",
                        Quantity = 1,
                        UnitPrice = 149.99m,
                        Currency = "USD"
                    }
                }.ToList();

                await harness.Bus.Publish(new OrderCreatedIntegrationEvent(
                    orderId,
                    customerId,
                    149.99m,
                    "USD",
                    items
                ));

                // Wait until the saga publishes CreatingShipment status (after stubs publish InventoryReserved, PaymentProcessed, ShipmentCreated)
                Assert.True(await harness.Published.Any<OrderStatusChangedIntegrationEvent>(
                    x => x.Context.Message.OrderId == orderId && x.Context.Message.Status == "CreatingShipment"),
                    "Expected CreatingShipment status to be published");

                // Finish the flow by publishing delivery event (shipment id matches stub)
                var deliveredShipmentId = $"SHP-{orderId:N}";
                await harness.Bus.Publish(new OrderDeliveredIntegrationEvent(
                    orderId,
                    deliveredShipmentId,
                    DateTime.UtcNow
                ));

                Assert.True(await harness.Published.Any<OrderStatusChangedIntegrationEvent>(
                    x => x.Context.Message.OrderId == orderId && x.Context.Message.Status == "Completed"),
                    "Expected Completed status to be published");
            }
            finally
            {
                await harness.Stop();
            }
        }

        [Fact]
        public async Task OrderCreateSaga_Cancels_On_Payment_Failure()
        {
            await using var provider = new ServiceCollection()
                .AddMassTransitTestHarness(cfg =>
                {
                    cfg.AddSagaStateMachine<OrderCreateSaga, OrderCreateSagaStateData>()
                        .InMemoryRepository();

                    cfg.UsingInMemory((context, busCfg) =>
                    {
                        // Inventory reserves OK
                        busCfg.ReceiveEndpoint("inventory", e =>
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

                        // Payment fails
                        busCfg.ReceiveEndpoint("payment", e =>
                        {
                            e.Handler<ProcessPaymentCommand>(async ctx =>
                            {
                                await ctx.Publish(new PaymentFailedIntegrationEvent(
                                    ctx.Message.OrderId,
                                    null,
                                    "Card declined",
                                    DateTime.UtcNow
                                ));
                            });

                            e.Handler<RefundPaymentCommand>(ctx => Task.CompletedTask);
                        });

                        // Shipping (unused in this test)
                        busCfg.ReceiveEndpoint("shipping", e =>
                        {
                            e.Handler<CreateShipmentCommand>(ctx => Task.CompletedTask);
                        });

                        EndpointConvention.Map<ReserveInventoryCommand>(new Uri("queue:inventory"));
                        EndpointConvention.Map<ReleaseInventoryCommand>(new Uri("queue:inventory"));
                        EndpointConvention.Map<ProcessPaymentCommand>(new Uri("queue:payment"));
                        EndpointConvention.Map<RefundPaymentCommand>(new Uri("queue:payment"));
                        EndpointConvention.Map<CreateShipmentCommand>(new Uri("queue:shipping"));

                        busCfg.ConfigureEndpoints(context);
                    });
                })
                .BuildServiceProvider(true);

            var harness = provider.GetRequiredService<ITestHarness>();
            var sagaHarness = provider.GetRequiredService<ISagaStateMachineTestHarness<OrderCreateSaga, OrderCreateSagaStateData>>();

            await harness.Start();
            try
            {
                var orderId = NewId.NextGuid();
                var customerId = NewId.NextGuid();

                var items2 = new[]
                {
                    new OrderItemCheckedOutDto
                    {
                        ProductId = NewId.NextGuid(),
                        ProductName = "Item",
                        Quantity = 1,
                        UnitPrice = 50m,
                        Currency = "USD"
                    }
                }.ToList();

                await harness.Bus.Publish(new OrderCreatedIntegrationEvent(
                    orderId,
                    customerId,
                    50m,
                    "USD",
                    items2
                ));

                Assert.True(await harness.Published.Any<OrderStatusChangedIntegrationEvent>(
                    x => x.Context.Message.OrderId == orderId && x.Context.Message.Status == "Cancelled"),
                    "Expected Cancelled status to be published");
            }
            finally
            {
                await harness.Stop();
            }
        }
    }
}