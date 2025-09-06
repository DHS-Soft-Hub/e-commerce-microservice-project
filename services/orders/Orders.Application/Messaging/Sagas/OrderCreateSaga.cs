using MassTransit;
using Orders.Application.Events;
// using Payment.Api.Events;

namespace Orders.Application.Sagas
{
    public class OrderCreateSaga : MassTransitStateMachine<OrderCreateSagaStateData>
    {
        // States
        public State ReservingInventory { get; private set; } = null!;
        public State ProcessingPayment { get; private set; } = null!;
        public State CreatingShipment { get; private set; } = null!;
        public State Shipped { get; private set; } = null!;
        public State Completed { get; private set; } = null!;
        public State Cancelled { get; private set; } = null!;
        public State Failed { get; private set; } = null!;

        // Events - Incoming
        public Event<OrderCreatedIntegrationEvent> OrderCreated { get; private set; } = null!;
        public Event<InventoryReservedIntegrationEvent> InventoryReserved { get; private set; } = null!;
        public Event<InventoryReservationFailedIntegrationEvent> InventoryReservationFailed { get; private set; } = null!;
        // public Event<PaymentProcessedIntegrationEvent> PaymentProcessed { get; private set; } = null!;
        public Event<PaymentFailedIntegrationEvent> PaymentFailed { get; private set; } = null!;
        public Event<ShipmentCreatedIntegrationEvent> ShipmentCreated { get; private set; } = null!;
        public Event<ShipmentFailedIntegrationEvent> ShipmentFailed { get; private set; } = null!;
        public Event<OrderDeliveredIntegrationEvent> OrderDelivered { get; private set; } = null!;

        public OrderCreateSaga()
        {
            InstanceState(x => x.CurrentState);

            // Configure event correlations
            Event(() => OrderCreated, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => InventoryReserved, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => InventoryReservationFailed, x => x.CorrelateById(m => m.Message.OrderId));
            // Event(() => PaymentProcessed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => PaymentFailed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => ShipmentCreated, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => ShipmentFailed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => OrderDelivered, x => x.CorrelateById(m => m.Message.OrderId));

            // Initial state: Order Created -> Reserve Inventory
            Initially(
                When(OrderCreated)
                    .Then(context =>
                    {
                        context.Saga.OrderId = context.Message.OrderId;
                        context.Saga.CustomerId = context.Message.CustomerId;
                        context.Saga.TotalPrice = context.Message.TotalPrice;
                        context.Saga.Currency = context.Message.Currency;
                        context.Saga.CreatedAt = DateTime.UtcNow;
                        context.Saga.InventoryStatus = "Pending";
                        context.Saga.RetryCount = 0;
                    })
                    .PublishAsync(context => context.Init<ReserveInventoryCommand>(new
                    {
                        OrderId = context.Message.OrderId,
                        CustomerId = context.Message.CustomerId,
                        Items = context.Message.Items.Select(item => new OrderItemRequest(
                            item.ProductId,
                            item.ProductName,
                            item.Quantity,
                            item.UnitPrice
                        )).ToList()
                    }))
                    .TransitionTo(ReservingInventory)
            );

            // Inventory Reserved -> Process Payment
            During(ReservingInventory,
                When(InventoryReserved)
                    .Then(context =>
                    {
                        context.Saga.InventoryStatus = context.Message.Status;
                        context.Saga.InventoryReservationId = context.Message.ReservationId;
                        context.Saga.PaymentStatus = "Pending";
                    })
                    .PublishAsync(context => context.Init<ProcessPaymentCommand>(new
                    {
                        OrderId = context.Saga.OrderId,
                        CustomerId = context.Saga.CustomerId,
                        Amount = context.Saga.TotalPrice,
                        Currency = context.Saga.Currency,
                        PaymentMethod = "CreditCard" // Default for now
                    }))
                    .TransitionTo(ProcessingPayment),

                // Inventory Reservation Failed -> Cancel Order
                When(InventoryReservationFailed)
                    .Then(context =>
                    {
                        context.Saga.InventoryStatus = "Failed";
                        context.Saga.LastError = context.Message.Reason;
                    })
                    .PublishAsync(context => context.Init<OrderStatusChangedIntegrationEvent>(new
                    {
                        OrderId = context.Saga.OrderId,
                        Status = "Cancelled",
                        Reason = "Inventory not available"
                    }))
                    .TransitionTo(Cancelled)
                    .Finalize()
            );

            // Payment Processed -> Create Shipment
            // During(ProcessingPayment,
            //     When(PaymentProcessed)
            //         .Then(context =>
            //         {
            //             context.Saga.PaymentStatus = context.Message.Status;
            //             context.Saga.PaymentId = context.Message.PaymentId;
            //             context.Saga.PaymentProcessedAt = DateTime.UtcNow;
            //             context.Saga.ShippingStatus = "Pending";
            //         })
            //         .PublishAsync(context => context.Init<CreateShipmentCommand>(new
            //         {
            //             OrderId = context.Saga.OrderId,
            //             CustomerId = context.Saga.CustomerId,
            //             Address = new ShippingAddress(
            //                 "123 Main St", // Mock address
            //                 "Anytown",
            //                 "CA",
            //                 "12345",
            //                 "USA"
            //             ),
            //             Items = new List<OrderItemRequest>() // Would need to get from order
            //         }))
            //         .TransitionTo(CreatingShipment),

            //     // Payment Failed -> Release Inventory + Cancel Order
            //     When(PaymentFailed)
            //         .Then(context =>
            //         {
            //             context.Saga.PaymentStatus = "Failed";
            //             context.Saga.LastError = context.Message.Reason;
            //         })
            //         .PublishAsync(context => context.Init<ReleaseInventoryCommand>(new
            //         {
            //             OrderId = context.Saga.OrderId,
            //             ReservationId = context.Saga.InventoryReservationId!
            //         }))
            //         .PublishAsync(context => context.Init<OrderStatusChangedIntegrationEvent>(new
            //         {
            //             OrderId = context.Saga.OrderId,
            //             Status = "Cancelled",
            //             Reason = "Payment failed"
            //         }))
            //         .TransitionTo(Cancelled)
            //         .Finalize()
            // );

            // Shipment Created -> Order Shipped
            During(CreatingShipment,
                When(ShipmentCreated)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = context.Message.Status;
                        context.Saga.ShipmentId = context.Message.ShipmentId;
                        context.Saga.ShippedAt = DateTime.UtcNow;
                    })
                    .PublishAsync(context => context.Init<OrderStatusChangedIntegrationEvent>(new
                    {
                        OrderId = context.Saga.OrderId,
                        Status = "Shipped",
                        Reason = "Order has been shipped"
                    }))
                    .TransitionTo(Shipped),

                // Shipment Failed -> Refund Payment + Release Inventory + Cancel Order
                When(ShipmentFailed)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = "Failed";
                        context.Saga.LastError = context.Message.Reason;
                    })
                    .PublishAsync(context => context.Init<RefundPaymentCommand>(new
                    {
                        OrderId = context.Saga.OrderId,
                        PaymentId = context.Saga.PaymentId!.Value,
                        Amount = context.Saga.TotalPrice,
                        Reason = "Shipping failed"
                    }))
                    .PublishAsync(context => context.Init<ReleaseInventoryCommand>(new
                    {
                        OrderId = context.Saga.OrderId,
                        ReservationId = context.Saga.InventoryReservationId!
                    }))
                    .PublishAsync(context => context.Init<OrderStatusChangedIntegrationEvent>(new
                    {
                        OrderId = context.Saga.OrderId,
                        Status = "Cancelled",
                        Reason = "Shipping failed"
                    }))
                    .TransitionTo(Cancelled)
                    .Finalize()
            );

            // Order Delivered -> Complete Order
            During(Shipped,
                When(OrderDelivered)
                    .Then(context =>
                    {
                        context.Saga.CompletedAt = DateTime.UtcNow;
                    })
                    .PublishAsync(context => context.Init<OrderStatusChangedIntegrationEvent>(new
                    {
                        OrderId = context.Saga.OrderId,
                        Status = "Completed",
                        Reason = "Order delivered successfully"
                    }))
                    .TransitionTo(Completed)
                    .Finalize()
            );

            SetCompletedWhenFinalized();
        }
    }
}