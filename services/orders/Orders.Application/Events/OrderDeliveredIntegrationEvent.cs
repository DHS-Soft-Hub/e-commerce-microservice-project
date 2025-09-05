using Shared.Domain.Events;

namespace Orders.Application.Events;

public record OrderDeliveredIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    DateTime DeliveredAt) : BaseIntegrationEvent;
