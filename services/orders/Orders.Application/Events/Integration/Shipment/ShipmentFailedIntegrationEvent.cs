using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Shipment;

public record ShipmentFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
