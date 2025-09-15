using MediatR;

namespace Orders.Application.Commands;

public record UpdateOrderStatusCommand(
    Guid OrderId,
    string NewStatus
) : IRequest<Unit>;