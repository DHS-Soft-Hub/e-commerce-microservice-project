using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Inventory;

public record InventoryReservedIntegrationEvent(
    Guid OrderId,
    string ReservationId,
    string Status,
    DateTime ReservedAt) : BaseIntegrationEvent;
