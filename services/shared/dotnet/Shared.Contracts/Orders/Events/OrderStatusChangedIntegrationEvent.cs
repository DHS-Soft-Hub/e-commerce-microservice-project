using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Events;

public record OrderStatusChangedIntegrationEvent(
    Guid OrderId,
    string Status,
    string Reason,
    DateTime ChangedAt = default) : BaseIntegrationEvent;
