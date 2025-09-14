namespace Shared.Contracts.ShoppingCart.Responses;

public record OrderCreatedResponse(
    Guid OrderId,
    bool Success,
    string Message
);