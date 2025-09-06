using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Shipment;

public record ShipmentDeliveredIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    string Status,
    DateTime DeliveredAt) : BaseIntegrationEvent;
