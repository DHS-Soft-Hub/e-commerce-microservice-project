using Orders.Domain.Entities;
using Orders.Domain.Enums;
using Orders.Domain.Events;
using Orders.Domain.ValueObjects;
using Shared.Domain.Aggregates;

namespace Orders.Domain.Aggregates
{
    public sealed class Order : AggregateRoot<OrderId>
    {
        public CustomerId CustomerId { get; private set; } = null!;
        public List<OrderItem> Items { get; private set; } = null!;
        public decimal TotalPrice { get; private set; }
        public string Currency { get; private set; } = "USD";
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

        public static Order Create(OrderId id, CustomerId customerId, List<OrderItem> items, string currency)
        {
            var order = new Order(id, customerId, items, currency);

            // Raise domain event
            OrderCreatedDomainEvent orderCreatedEvent = new OrderCreatedDomainEvent(id, customerId, order.Status, order.TotalPrice, order.Items);
            order.AddDomainEvent(orderCreatedEvent);
            return order;
        }

        public void UpdateStatus(OrderStatus newStatus)
        {
            if (Status != newStatus)
            {
                Status = newStatus;
                // Could add domain events here for status changes if needed
            }
        }

        // parameterless constructor for EF Core
        protected Order() : base(new OrderId())
        {
            Items = new List<OrderItem>();
        }
    }
}
