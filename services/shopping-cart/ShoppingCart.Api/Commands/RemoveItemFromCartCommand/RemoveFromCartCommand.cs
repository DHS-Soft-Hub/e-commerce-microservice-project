using MediatR;

namespace ShoppingCart.Api.Commands.RemoveItemFromCartCommand;

public record RemoveItemFromCartCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId) : IRequest<Unit>;
