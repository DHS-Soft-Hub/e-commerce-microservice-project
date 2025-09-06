using System;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
using Microsoft.Extensions.DependencyInjection;
using Orders.Application.Sagas;
using Orders.Application.Messaging.Contracts;
using Orders.Application.Events.Integration.Inventory;
using Orders.Application.Events.Integration.Payment;
using Orders.Application.Events.Integration.Shipment;
using Orders.Application.Events.Integration.Order;
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
                                await ctx.Publish<InventoryReservedIntegrationEvent>(new
                                {
                                    OrderId = ctx.Message.OrderId,
                                    ReservationId = NewId.NextGuid(),
                                    Status = "Reserved"
                                });
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
                                await ctx.Publish<PaymentProcessedIntegrationEvent>(new
                                {
                                    OrderId = ctx.Message.OrderId,
                                    PaymentId = NewId.NextGuid(),
                                    Status = "Processed"
                                });
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
                                await ctx.Publish<ShipmentCreatedIntegrationEvent>(new
                                {
                                    OrderId = ctx.Message.OrderId,
                                    ShipmentId = NewId.NextGuid(),
                                    Status = "Created"
                                });
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

                // Kick off the saga
                await harness.Bus.Publish<OrderCreatedIntegrationEvent>(new
                {
                    OrderId = orderId,
                    CustomerId = customerId,
                    TotalPrice = 149.99m,
                    Currency = "USD",
                    Items = new[]
                    {
                        new
                        {
                            ProductId = NewId.NextGuid(),
                            ProductName = "Demo Product",
                            Quantity = 1,
                            UnitPrice = 149.99m
                        }
                    }
                });

                // Wait until the saga reaches Shipped (after stubs publish InventoryReserved, PaymentProcessed, ShipmentCreated)
                var shippedInstanceId = await sagaHarness.Exists(orderId, x => x.Shipped, timeout: TimeSpan.FromSeconds(10));
                Assert.NotNull(shippedInstanceId);

                // Finish the flow by publishing delivery event
                await harness.Bus.Publish<OrderDeliveredIntegrationEvent>(new
                {
                    OrderId = orderId
                });

                var completedInstanceId = await sagaHarness.Exists(orderId, x => x.Completed, timeout: TimeSpan.FromSeconds(10));
                Assert.NotNull(completedInstanceId);
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
                                await ctx.Publish<InventoryReservedIntegrationEvent>(new
                                {
                                    OrderId = ctx.Message.OrderId,
                                    ReservationId = NewId.NextGuid(),
                                    Status = "Reserved"
                                });
                            });

                            e.Handler<ReleaseInventoryCommand>(ctx => Task.CompletedTask);
                        });

                        // Payment fails
                        busCfg.ReceiveEndpoint("payment", e =>
                        {
                            e.Handler<ProcessPaymentCommand>(async ctx =>
                            {
                                await ctx.Publish<PaymentFailedIntegrationEvent>(new
                                {
                                    OrderId = ctx.Message.OrderId,
                                    Reason = "Card declined"
                                });
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

                await harness.Bus.Publish<OrderCreatedIntegrationEvent>(new
                {
                    OrderId = orderId,
                    CustomerId = customerId,
                    TotalPrice = 50m,
                    Currency = "USD",
                    Items = new[]
                    {
                        new { ProductId = NewId.NextGuid(), ProductName = "Item", Quantity = 1, UnitPrice = 50m }
                    }
                });

                var cancelledId = await sagaHarness.Exists(orderId, x => x.Cancelled, timeout: TimeSpan.FromSeconds(10));
                Assert.NotNull(cancelledId);
            }
            finally
            {
                await harness.Stop();
            }
        }
    }
}