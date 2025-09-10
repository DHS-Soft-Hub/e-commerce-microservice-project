using Shared.Domain.Events;

namespace Shared.Contracts.Inventory.Events;

public record InventoryReleasedIntegrationEvent(
    Guid OrderId,
    string ReservationId,
    string Status,
    DateTime ReleasedAt) : BaseIntegrationEvent;
