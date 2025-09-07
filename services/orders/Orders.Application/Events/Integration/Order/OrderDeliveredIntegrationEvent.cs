using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Order;

public record OrderDeliveredIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    DateTime DeliveredAt) : BaseIntegrationEvent;
