using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Shipment;

public record ShipmentCreatedIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    string Status,
    DateTime CreatedAt) : BaseIntegrationEvent;
