using Orders.Domain.ValueObjects;
using Shared.Domain.ValueObjects;

namespace Orders.Application.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public Money TotalPrice { get; set; } = Money.Zero("EUR");
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
    }
}
