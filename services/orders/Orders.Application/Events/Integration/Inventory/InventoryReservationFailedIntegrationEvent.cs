using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Inventory;

public record InventoryReservationFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
