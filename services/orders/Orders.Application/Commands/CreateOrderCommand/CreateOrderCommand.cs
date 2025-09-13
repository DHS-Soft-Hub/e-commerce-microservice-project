using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;

namespace Orders.Application.Commands
{
    public record CreateOrderCommand(
        Guid CustomerId,
        IReadOnlyList<CreateOrderItemRequestDto> Items,
        string Currency = "EUR"
    ) : IRequest<CreateOrderResponseDto>;
}