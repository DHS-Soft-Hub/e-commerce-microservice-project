namespace ShoppingCart.Api.Contracts.Responses;

public record CheckoutResultResponse(
    bool Success,
    string? Message,
    Guid? OrderId);