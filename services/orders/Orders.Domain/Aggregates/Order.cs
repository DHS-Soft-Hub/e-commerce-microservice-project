using Orders.Domain.Entities;
using Orders.Domain.Enums;
using Orders.Domain.Events;
using Orders.Domain.ValueObjects;
using Shared.Domain.Aggregates;
using Shared.Domain.Common;

namespace Orders.Domain.Aggregates
{
    public sealed class Order : AggregateRoot<OrderId>
    {
        public CustomerId CustomerId { get; private set; } = null!;
        public List<OrderItem> Items { get; private set; } = null!;
        public decimal TotalPrice { get; private set; }
        public string Currency { get; private set; } = "EUR";
        public OrderStatus Status { get; private set; } = OrderStatus.Pending;
        public DateTime CreatedDate { get; private set; } = DateTime.UtcNow;

        protected Order(OrderId id, CustomerId customerId, List<OrderItem> items, string currency)
            : base(id)
        {
            CustomerId = customerId;
            Items = items ?? new List<OrderItem>();
            CreatedDate = DateTime.UtcNow;
            Currency = currency;
            TotalPrice = Items.Sum(i => i.UnitPrice * i.Quantity);
        }

        // parameterless constructor for EF Core
        protected Order() : base(new OrderId())
        {
            Items = new List<OrderItem>();
        }

        public static Result<Order> Create(OrderId id, CustomerId customerId, List<OrderItem> items, string currency)
        {
            var order = new Order(id, customerId, items, currency);

            // Raise domain event
            OrderCreatedDomainEvent orderCreatedEvent = new OrderCreatedDomainEvent(id, customerId, order.Status, order.TotalPrice, order.Items);
            order.AddDomainEvent(orderCreatedEvent);

            return Result<Order>.Success(order);
        }

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
            Currency = currency;
            TotalPrice = Items.Sum(i => i.UnitPrice * i.Quantity);

            if (!string.IsNullOrWhiteSpace(status) &&
                Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
            {
                if (UpdateStatus(parsedStatus).IsFailure)
                {
                    return Result<Order>.Failure("Failed to update order status.");
                }
            }

            return Result<Order>.Success(this);
        }

        public Result UpdateStatus(OrderStatus newStatus)
        {
            if (!Enum.IsDefined(typeof(OrderStatus), newStatus))
            {
                return Result.Failure("Invalid order status.");
            }

            Status = newStatus;
            return Result.Success();
        }
    
        public Result AddItem(OrderItem item)
        {
            if (item == null)
            {
                return Result.Failure("Order item cannot be null.");
            }
            if (item.UnitPrice < 0)
            {
                return Result.Failure("Unit price cannot be negative.");
            }

            if (item.Quantity <= 0)
            {
                return Result.Failure("Quantity must be greater than zero.");
            }

            Items.Add(item);
            TotalPrice += item.UnitPrice * item.Quantity;
            return Result.Success();
        }

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

            TotalPrice -= item.UnitPrice * item.Quantity;
            return Result.Success();
        }
    }
}
