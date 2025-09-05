using Shared.Domain.Events;

namespace Orders.Application.Events;

public record InventoryReservedIntegrationEvent(
    Guid OrderId,
    string ReservationId,
    string Status,
    DateTime ReservedAt) : BaseIntegrationEvent;
