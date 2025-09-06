using Shared.Domain.Events;

namespace Orders.Application.Events;

public record OrderStatusChangedIntegrationEvent(
    Guid OrderId,
    string Status,
    string Reason,
    DateTime ChangedAt = default) : BaseIntegrationEvent
{
    public DateTime ChangedAt { get; init; } = ChangedAt == default ? DateTime.UtcNow : ChangedAt;
}
