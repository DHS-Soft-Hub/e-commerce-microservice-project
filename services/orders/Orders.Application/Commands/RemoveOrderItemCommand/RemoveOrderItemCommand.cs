using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Commands;

public record RemoveOrderItemCommand(Guid OrderId, Guid ItemId) : IRequest<OrderDto>;
