using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ShipmentFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
