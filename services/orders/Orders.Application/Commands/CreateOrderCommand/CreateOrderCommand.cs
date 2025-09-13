using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Responses;

namespace Orders.Application.Commands
{
    public record CreateOrderCommand(
        Guid CustomerId,
        IReadOnlyList<OrderItemDto> Items,
        string Currency = "EUR"
    ) : IRequest<CreateOrderResponseDto>;
}