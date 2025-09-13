using Shared.Domain.Events;

namespace Shared.Contracts.ShoppingCart.Events;

public record CartCheckedOutIntegrationEvent(
    Guid CartId,
    Guid UserId,
    string SessionId,
    List<CartItemCheckedOutDto> Items,
    decimal Total,
    string Currency,
    DateTime OccurredAt
) : BaseIntegrationEvent;

public record CartItemCheckedOutDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    string Currency
);