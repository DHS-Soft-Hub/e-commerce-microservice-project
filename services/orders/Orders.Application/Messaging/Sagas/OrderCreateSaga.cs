using MassTransit;
using Orders.Application.Commands;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Inventory.Events;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.Orders.Models;
using Shared.Contracts.Payments.Events;
using Shared.Contracts.Shipment.Events;
using Shared.Contracts.ShoppingCart.Events;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;

namespace Orders.Application.Sagas
{
    public class OrderCreateSaga : MassTransitStateMachine<OrderCreateSagaStateData>
    {
        // States
        public State CreatingOrder { get; private set; } = null!;
        public State ReservingInventory { get; private set; } = null!;
        public State ProcessingPayment { get; private set; } = null!;
        public State CreatingShipment { get; private set; } = null!;
        public State WaitingForDelivery { get; private set; } = null!;
        public State Shipped { get; private set; } = null!;
        public State Completed { get; private set; } = null!;
        public State Cancelled { get; private set; } = null!;
        public State Failed { get; private set; } = null!;

        // Events - Incoming
        public Event<CartCheckedOutIntegrationEvent> CartCheckedOut { get; private set; } = null!;
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
            Event(() => CartCheckedOut, x =>
            {
                // Start saga with cart checkout - generate a new OrderId for correlation
                x.CorrelateById(context => NewId.NextGuid()); // Generate unique OrderId for this saga
                x.SelectId(context => NewId.NextGuid()); // This will be our OrderId
            });

            Event(() => OrderCreated, x =>
            {
                // Correlate by OrderId for backward compatibility
                x.CorrelateById(context => context.Message.OrderId);
                x.SelectId(context => context.Message.OrderId);
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

            // Initial state: Cart Checked Out -> Create Order -> Wait for OrderCreated
            Initially(
                When(CartCheckedOut)
                    .Then(context =>
                    {
                        // Generate a new OrderId for this order
                        var orderId = context.Saga.CorrelationId; // Use saga correlation ID as OrderId
                        context.Saga.OrderId = orderId;
                        context.Saga.CustomerId = context.Message.UserId; // Cart has UserId, Order needs CustomerId
                        context.Saga.TotalPrice = context.Message.Total;
                        context.Saga.Currency = context.Message.Currency;
                        context.Saga.CreatedAt = DateTime.UtcNow;
                        context.Saga.InventoryStatus = "Pending";
                        context.Saga.RetryCount = 0;
                    })
                    // Send command to create the order entity
                    .Send(context => new CreateOrderCommand
                    (
                        context.Message.UserId, // UserId from cart becomes CustomerId for order
                        context.Message.Items.Select(item => new CreateOrderItemRequestDto
                        (
                            item.ProductId,
                            item.ProductName,
                            item.Quantity,
                            item.UnitPrice,
                            item.Currency
                        )).ToList(),
                        context.Message.Currency
                    ))
                    .TransitionTo(CreatingOrder),

                // Handle direct OrderCreated events (for backward compatibility)
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
                    .Publish(context => new ReserveInventoryCommand(
                        context.Message.OrderId,
                        context.Message.CustomerId,
                        context.Message.Items.Select(item => new OrderItemRequest(
                            item.ProductId,
                            item.ProductName,
                            item.Quantity,
                            item.UnitPrice
                        )).ToList()
                    ))
                    .TransitionTo(ReservingInventory)
            );

            // Order creation completed -> Start inventory reservation
            During(CreatingOrder,
                When(OrderCreated)
                    .Then(context =>
                    {
                        // Order was successfully created, now proceed with inventory reservation
                        context.Saga.InventoryStatus = "Pending";
                    })
                    .Publish(context => new ReserveInventoryCommand(
                        context.Message.OrderId,
                        context.Message.CustomerId,
                        context.Message.Items.Select(item => new OrderItemRequest(
                            item.ProductId,
                            item.ProductName,
                            item.Quantity,
                            item.UnitPrice
                        )).ToList()
                    ))
                    .TransitionTo(ReservingInventory)
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "InventoryReserved"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Cancelled"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Paid"
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
                        new List<OrderItemRequest>()
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Cancelled"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Shipped"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Cancelled"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Completed"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Completed"
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
                    .Send(context => new UpdateOrderStatusCommand(
                        context.Saga.OrderId,
                        "Completed"
                    ))
                    .TransitionTo(Completed)
                    .Finalize()
            );

            SetCompletedWhenFinalized();
        }
    }
}