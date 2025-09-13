using Orders.Domain.Entities;
using Orders.Domain.Enums;
using Orders.Domain.Events;
using Orders.Domain.ValueObjects;
using Shared.Domain.Aggregates;
using Shared.Domain.Common;
using Shared.Domain.ValueObjects;

namespace Orders.Domain.Aggregates
{
    public sealed class Order : AggregateRoot<OrderId>
    {
        public CustomerId CustomerId { get; private set; } = null!;
        public List<OrderItem> Items { get; private set; } = null!;
        public Money TotalPrice { get; private set; } = null!;
        public OrderStatus Status { get; private set; } = OrderStatus.Pending;
        public PaymentId? PaymentId { get; private set; }
        public ShipmentId? ShipmentId { get; private set; }
        public DateTime CreatedDate { get; private set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; private set; } = DateTime.UtcNow;


        private Order(CustomerId customerId, List<OrderItem> items, string currency)
            : base(new OrderId())
        {
            CustomerId = customerId;
            Items = items ?? new List<OrderItem>();
            CreatedDate = DateTime.UtcNow;
            TotalPrice = CalculateTotal(Items, currency);
        }

        // parameterless constructor for EF Core
        private Order() : base(new OrderId())
        {
            Items = new List<OrderItem>();
            TotalPrice = Money.Zero("EUR");
        }

        /// <summary>
        /// Creates a new order instance.
        /// Raises an OrderCreatedDomainEvent upon successful creation.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="customerId"></param>
        /// <param name="items"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        public static Result<Order> Create(CustomerId customerId, string currency)
        {
            var order = new Order(customerId, new List<OrderItem>(), currency);

            // Raise domain event
            OrderCreatedDomainEvent orderCreatedEvent = new OrderCreatedDomainEvent(
                order.Id,
                customerId,
                order.Status,
                order.TotalPrice.Amount,
                order.TotalPrice.Currency,
                order.Items
            );
            order.AddDomainEvent(orderCreatedEvent);

            return Result<Order>.Success(order);
        }

        /// <summary>
        /// Updates the order details.
        /// Validates that the order ID cannot be changed and customer ID is not null.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="customerId"></param>
        /// <param name="items"></param>
        /// <param name="currency"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public Result<Order> Update(OrderId id, CustomerId customerId, List<OrderItem> items, string currency, string? status = null)
        {
            if (id != Id)
            {
                return Result<Order>.Failure("Order ID cannot be changed.");
            }

            if (customerId == null)
            {
                return Result<Order>.Failure("Customer ID cannot be null.");
            }

            CustomerId = customerId;
            Items = items ?? new List<OrderItem>();
            TotalPrice = CalculateTotal(Items, currency);
            var resultStatus = UpdateStatus(status ?? Status.ToString());
            if (resultStatus.IsFailure)
            {
                return Result<Order>.Failure(resultStatus.Errors);
            }

            return Result<Order>.Success(this);
        }

        /// <summary>
        /// Updates the order status.
        /// Validates that the new status is a valid enum value.
        /// </summary>
        /// <param name="newStatus"></param>
        /// <returns></returns>
        public Result UpdateStatus(string newStatus)
        {
            if (!Enum.IsDefined(typeof(OrderStatus), newStatus))
            {
                return Result.Failure("Invalid order status.");
            }

            Status = (OrderStatus)Enum.Parse(typeof(OrderStatus), newStatus);
            return Result.Success();
        }
    
        /// <summary>
        /// Adds an item to the order.
        /// Validates that the item is not null, unit price is non-negative, and quantity
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public Result AddItem(OrderItem item)
        {
            if (item == null)
            {
                return Result.Failure("Order item cannot be null.");
            }
            if (item.UnitPrice.Amount < 0)
            {
                return Result.Failure("Unit price cannot be negative.");
            }

            if (item.Quantity <= 0)
            {
                return Result.Failure("Quantity must be greater than zero.");
            }

            Items.Add(item);
            TotalPrice = TotalPrice.Add(item.UnitPrice.Multiply(item.Quantity));
            return Result.Success();
        }

        /// <summary>
        /// Removes an item from the order.
        /// Validates that the item is not null and exists in the order.
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public Result RemoveItem(OrderItem item)
        {
            if (item == null)
            {
                return Result.Failure("Order item cannot be null.");
            }

            if (!Items.Remove(item))
            {
                return Result.Failure("Item not found in order.");
            }

            TotalPrice = TotalPrice.Subtract(item.UnitPrice.Multiply(item.Quantity));
            return Result.Success();
        }

        /// <summary>
        /// Associates a payment with this order
        /// </summary>
        /// <param name="paymentId"></param>
        /// <returns></returns>
        public Result AssignPayment(PaymentId paymentId)
        {
            if (paymentId == null)
                return Result.Failure("Payment ID cannot be null.");

            PaymentId = paymentId;
            return Result.Success();
        }

        /// <summary>
        /// Associates a shipment with this order
        /// </summary>
        /// <param name="shipmentId"></param>
        /// <returns></returns>
        public Result AssignShipment(ShipmentId shipmentId)
        {
            if (shipmentId == null)
                return Result.Failure("Shipment ID cannot be null.");

            ShipmentId = shipmentId;
            return Result.Success();
        }

        /// <summary>
        /// Calculates the total price for the given items in the specified currency
        /// </summary>
        /// <param name="items"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        private static Money CalculateTotal(List<OrderItem> items, string currency)
        {
            if (items == null || !items.Any())
                return Money.Zero(currency);

            var total = items.Sum(item => item.GetTotal().IsSuccess ? item.GetTotal().Value?.Amount : 0);
            return new Money(total ?? 0, currency);
        }
    }
}
