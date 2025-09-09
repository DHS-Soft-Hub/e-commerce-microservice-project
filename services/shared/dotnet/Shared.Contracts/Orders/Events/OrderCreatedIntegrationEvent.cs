using Shared.Contracts.Orders.Models;
using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Events;

public record OrderCreatedIntegrationEvent (
    Guid OrderId,
    Guid CustomerId,
    decimal TotalPrice,
    string Currency,
    List<OrderItemDto> Items) : BaseIntegrationEvent;
