using Shared.Domain.Events;

namespace Shared.Contracts.Inventory.Events;

public record InventoryReservedIntegrationEvent(
    Guid OrderId,
    string ReservationId,
    string Status,
    DateTime ReservedAt) : BaseIntegrationEvent;
