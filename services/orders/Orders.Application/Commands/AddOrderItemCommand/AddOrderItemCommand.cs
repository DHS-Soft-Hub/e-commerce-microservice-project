using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Commands;

public record AddOrderItemCommand (
    Guid OrderId,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    string Currency
) : IRequest<OrderItemDto>;
