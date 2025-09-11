using Orders.Domain.ValueObjects;
using Shared.Domain.ValueObjects;

namespace Orders.Application.DTOs
{
    public class OrderItemDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public Money UnitPrice { get; set; } = Money.Zero("EUR");
        public Money TotalPrice => UnitPrice.Multiply(Quantity);
    }
}
