using Shared.Domain.Events;

namespace Shared.Contracts.Shipment.Events;

public record ShipmentFailedIntegrationEvent(
    Guid OrderId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
