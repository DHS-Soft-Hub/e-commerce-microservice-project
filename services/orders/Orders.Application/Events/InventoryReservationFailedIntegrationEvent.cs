using Shared.Domain.Events;

namespace Orders.Application.Events;

public record InventoryReservationFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
