using Orders.Application.DTOs;
using MediatR;

namespace Orders.Application.Commands;

public class UpdateOrderCommand : IRequest<OrderDto>
{
    public Guid OrderId { get; set; } = Guid.Empty;
    public Guid CustomerId { get; set; } = Guid.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}