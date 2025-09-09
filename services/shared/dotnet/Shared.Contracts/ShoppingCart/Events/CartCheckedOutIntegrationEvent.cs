using Shared.Contracts.Orders.Models;
using Shared.Domain.Events;

namespace Shared.Contracts.ShoppingCart.Events;

public record CartCheckedOutIntegrationEvent(
    Guid OrderId,
    Guid CustomerId,
    IReadOnlyList<OrderItemDto> Items,
    decimal Total,
    string Currency,
    DateTime OccurredAt
) : BaseIntegrationEvent;
