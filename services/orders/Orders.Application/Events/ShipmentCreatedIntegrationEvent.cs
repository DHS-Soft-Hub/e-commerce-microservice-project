using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ShipmentCreatedIntegrationEvent(
    Guid OrderId,
    string ShipmentId,
    string Status,
    DateTime CreatedAt) : BaseIntegrationEvent;
