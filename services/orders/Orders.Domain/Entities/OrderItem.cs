using Orders.Domain.ValueObjects;
using Shared.Domain.Entities;

namespace Orders.Domain.Entities
{
    public sealed class OrderItem : BaseEntity<OrderItemId>
    {
        public OrderId OrderId { get; private set; }
        public ProductId ProductId { get; private set; }
        public string ProductName { get; private set; } = string.Empty;
        public int Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public string Currency { get; private set; } = string.Empty;

        public OrderItem(
            OrderItemId id,
            OrderId orderId,
            ProductId productId,
            string productName,
            int quantity,
            decimal unitPrice,
            string currency) : base(id)
        {
            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            Currency = currency;
        }
    }
}
