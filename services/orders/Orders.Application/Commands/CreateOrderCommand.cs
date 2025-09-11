using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Commands
{
    public class CreateOrderCommand : IRequest<OrderDto>
    {
        public Guid? OrderId { get; set; } // Optional: Let saga specify the OrderId
        public Guid CustomerId { get; set; }
        public List<CreateOrderItemDto> Items { get; set; } = new();
        public string Currency { get; set; } = "USD";
    }

    public class CreateOrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public int Quantity { get; set; }
    }
}
