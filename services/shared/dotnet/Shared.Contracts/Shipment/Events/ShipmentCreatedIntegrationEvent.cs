using Shared.Domain.Events;

namespace Shared.Contracts.Shipment.Events;

public record ShipmentCreatedIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    string Status,
    DateTime CreatedAt) : BaseIntegrationEvent;
