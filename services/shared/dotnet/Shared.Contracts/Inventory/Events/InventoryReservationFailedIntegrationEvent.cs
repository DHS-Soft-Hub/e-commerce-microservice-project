using Shared.Domain.Events;

namespace Shared.Contracts.Inventory.Events;

public record InventoryReservationFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
