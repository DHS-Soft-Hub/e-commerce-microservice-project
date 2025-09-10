using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Events;

public record OrderDeliveredIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    DateTime DeliveredAt) : BaseIntegrationEvent;
