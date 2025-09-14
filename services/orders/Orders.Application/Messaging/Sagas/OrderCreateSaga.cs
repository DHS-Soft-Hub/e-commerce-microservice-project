using MassTransit;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Inventory.Events;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.Payments.Events;
using Shared.Contracts.Shipment.Events;

namespace Orders.Application.Sagas
{
    public class OrderCreateSaga : MassTransitStateMachine<OrderCreateSagaStateData>
    {
        // States
        public State ReservingInventory { get; private set; } = null!;
        public State ProcessingPayment { get; private set; } = null!;
        public State CreatingShipment { get; private set; } = null!;
        public State WaitingForDelivery { get; private set; } = null!;
        public State Shipped { get; private set; } = null!;
        public State Completed { get; private set; } = null!;
        public State Cancelled { get; private set; } = null!;
        public State Failed { get; private set; } = null!;

        // Events - Incoming
        public Event<OrderCreatedIntegrationEvent> OrderCreated { get; private set; } = null!;
        public Event<InventoryReservedIntegrationEvent> InventoryReserved { get; private set; } = null!;
        public Event<InventoryReservationFailedIntegrationEvent> InventoryReservationFailed { get; private set; } = null!;
        public Event<PaymentProcessedIntegrationEvent> PaymentProcessed { get; private set; } = null!;
        public Event<PaymentFailedIntegrationEvent> PaymentFailed { get; private set; } = null!;
        public Event<ShipmentCreatedIntegrationEvent> ShipmentCreated { get; private set; } = null!;
        public Event<ShipmentFailedIntegrationEvent> ShipmentFailed { get; private set; } = null!;
        public Event<OrderShippedIntegrationEvent> OrderShipped { get; private set; } = null!;
        public Event<OrderDeliveredIntegrationEvent> OrderDelivered { get; private set; } = null!;

        public OrderCreateSaga()
        {
            InstanceState(x => x.CurrentState);

            // Configure event correlations
            Event(() => OrderCreated, x =>
            {
                // Correlate by OrderId for backward compatibility
                x.CorrelateById(context => context.Message.Id);
                x.SelectId(context => context.Message.Id);
            });

            Event(() => InventoryReserved, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => InventoryReservationFailed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => PaymentProcessed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => PaymentFailed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => ShipmentCreated, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => ShipmentFailed, x => x.CorrelateById(m => m.Message.OrderId));
            Event(() => OrderShipped, x =>
            {
                x.CorrelateById(m => m.Message.OrderId);
                x.OnMissingInstance(m => m.Discard());
            });
            Event(() => OrderDelivered, x =>
            {
                x.CorrelateById(m => m.Message.OrderId);
                x.OnMissingInstance(m => m.Discard());
            });

            // Initial state: Order Created -> Reserve Inventory
            Initially(
                // Wait for Order Created event to proceed
                When(OrderCreated)
                    .Then(context =>
                    {
                        // Initialize saga state from the order created event
                        context.Saga.OrderId = context.Message.Id;
                        context.Saga.CustomerId = context.Message.CustomerId;
                        context.Saga.TotalPrice = context.Message.TotalPrice;
                        context.Saga.Currency = context.Message.Currency;
                        context.Saga.CreatedAt = DateTime.UtcNow;
                        context.Saga.InventoryStatus = "Pending";
                        context.Saga.RetryCount = 0;
                    })
                    .Publish(context => new ReserveInventoryCommand(
                        context.Message.Id,
                        context.Message.CustomerId,
                        context.Message.Items.Select(item => new InventoryItemRequest(
                            item.ProductId,
                            item.Quantity
                        )).ToList()
                    ))
                    .TransitionTo(ReservingInventory)
            );

            // Handle duplicate OrderCreated events in any non-initial state (ignore them)
            DuringAny(
                When(OrderCreated)
                    .Then(context =>
                    {
                        // Log that we received a duplicate OrderCreated event and ignore it
                        Console.WriteLine($"Ignoring duplicate OrderCreated event for Order {context.Message.Id} in state {context.Saga.CurrentState}");
                    })
                    // Stay in current state, don't transition
            );

            // Inventory Reserved -> Process Payment
            During(ReservingInventory,
                When(InventoryReserved)
                    .Then(context =>
                    {
                        context.Saga.InventoryStatus = context.Message.Status;
                        context.Saga.InventoryReservationId = context.Message.ReservationId;
                        context.Saga.PaymentStatus = "InventoryReserved";
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "InventoryReserved",
                        "Inventory successfully reserved",
                        DateTime.UtcNow
                    ))
                    .Publish(context => new ProcessPaymentCommand(
                        context.Saga.OrderId,
                        context.Saga.CustomerId,
                        context.Saga.TotalPrice,
                        context.Saga.Currency,
                        "CreditCard" // Default for now
                    ))
                    .TransitionTo(ProcessingPayment),

                // Inventory Reservation Failed -> Cancel Order
                When(InventoryReservationFailed)
                    .Then(context =>
                    {
                        context.Saga.InventoryStatus = "Failed";
                        context.Saga.LastError = context.Message.Reason;
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Cancelled",
                        $"Inventory reservation failed: {context.Message.Reason}",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Cancelled)
                    .Finalize()
            );

            //Payment Processed -> Create Shipment
            During(ProcessingPayment,
                When(PaymentProcessed)
                    .Then(context =>
                    {
                        context.Saga.PaymentStatus = context.Message.Status;
                        context.Saga.PaymentId = context.Message.PaymentId;
                        context.Saga.PaymentProcessedAt = DateTime.UtcNow;
                        context.Saga.ShippingStatus = "Paid";
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Paid",
                        "Payment successfully processed",
                        DateTime.UtcNow
                    ))
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "CreatingShipment",
                        "Payment complete, creating shipment",
                        DateTime.UtcNow
                    ))
                    .Publish(context => new CreateShipmentCommand(
                        context.Saga.OrderId,
                        context.Saga.CustomerId,
                        new ShippingAddress(
                            "123 Main St",
                            "Anytown",
                            "CA",
                            "12345",
                            "USA"
                        ),
                        new List<ShipmentItemRequest>()
                    ))
                    .TransitionTo(CreatingShipment),

                // Payment Failed -> Release Inventory + Cancel Order
                When(PaymentFailed)
                    .Then(context =>
                    {
                        context.Saga.PaymentStatus = "Failed";
                        context.Saga.LastError = context.Message.Reason;
                    })
                    .Publish(context => new ReleaseInventoryCommand(
                        context.Saga.OrderId,
                        context.Saga.InventoryReservationId!
                    ))
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Cancelled",
                        $"Payment failed: {context.Message.Reason}",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Cancelled)
                    .Finalize()
            );

            // Shipment Created -> Order Shipped
            During(CreatingShipment,
                When(ShipmentCreated)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = context.Message.Status;
                        context.Saga.ShipmentId = context.Message.ShipmentId;
                        context.Saga.ShippedAt = DateTime.UtcNow;
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Shipped",
                        "Shipment created and ready for delivery",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Shipped),

                // Shipment Failed -> Refund Payment + Release Inventory + Cancel Order
                When(ShipmentFailed)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = "Failed";
                        context.Saga.LastError = context.Message.Reason;
                    })
                    .Publish(context => new RefundPaymentCommand(
                        context.Saga.OrderId,
                        context.Saga.PaymentId!.Value,
                        context.Saga.TotalPrice,
                        "Shipping failed"
                    ))
                    .Publish(context => new ReleaseInventoryCommand(
                        context.Saga.OrderId,
                        context.Saga.InventoryReservationId!
                    ))
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Cancelled",
                        $"Shipment failed: {context.Message.Reason}",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Cancelled)
                    .Finalize(),

                // Accept Delivered even if it arrives early (out-of-order)
                When(OrderDelivered)
                    .Then(context =>
                    {
                        context.Saga.ShipmentId = context.Message.ShipmentId;
                        context.Saga.ShippingStatus = "Delivered";
                        context.Saga.CompletedAt = DateTime.UtcNow;
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Completed",
                        "Order delivered successfully",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Completed)
                    .Finalize()
            );

            // Order Delivered after shipped
            During(Shipped,
                When(OrderShipped)
                    .Then(context =>
                    {
                        context.Saga.ShipmentId = context.Message.ShipmentId;
                        context.Saga.ShippingStatus = "Shipped";
                        context.Saga.ShippedAt = InVar.Timestamp;
                    })
                    .TransitionTo(WaitingForDelivery),
                When(OrderDelivered)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = "Delivered";
                        context.Saga.CompletedAt = DateTime.UtcNow;
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Completed",
                        "Order delivered successfully",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Completed)
                    .Finalize()
            );

            // Order Delivered -> After shipped
            During(WaitingForDelivery,
                When(OrderDelivered)
                    .Then(context =>
                    {
                        context.Saga.ShippingStatus = "Delivered";
                        context.Saga.CompletedAt = DateTime.UtcNow;
                    })
                    .Publish(context => new OrderStatusChangedIntegrationEvent(
                        context.Saga.OrderId,
                        "Completed",
                        "Order delivered successfully",
                        DateTime.UtcNow
                    ))
                    .TransitionTo(Completed)
                    .Finalize()
            );

            SetCompletedWhenFinalized();
        }
    }
}