using Shared.Domain.Events;

namespace Orders.Application.Events;

public record InventoryReleasedIntegrationEvent(
    Guid OrderId,
    string ReservationId,
    string Status,
    DateTime ReleasedAt) : BaseIntegrationEvent;
