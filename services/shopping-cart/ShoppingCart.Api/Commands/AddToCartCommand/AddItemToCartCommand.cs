using MediatR;

namespace ShoppingCart.Api.Commands.AddItemToCartCommand;

public record AddItemToCartCommand(
    Guid? UserId,
    string? SessionId,
    Guid ProductId,
    string ProductName,
    decimal Price,
    string Currency,
    int Quantity) : IRequest<Unit>;
