using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ShipmentDeliveredIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    string Status,
    DateTime DeliveredAt) : BaseIntegrationEvent;
