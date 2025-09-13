using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;

namespace Orders.Application.Commands;

public record AddOrderItemCommand (
    Guid OrderId,
    CreateOrderItemRequestDto Item
) : IRequest<OrderDto>;
