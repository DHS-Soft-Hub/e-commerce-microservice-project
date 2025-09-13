using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Commands;

public record UpdateOrderItemQuantityCommand(Guid OrderId, Guid ItemId, int Quantity) : IRequest<OrderDto>;
