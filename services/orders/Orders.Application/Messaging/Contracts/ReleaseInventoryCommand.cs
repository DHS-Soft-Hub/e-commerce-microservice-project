using Shared.Domain.Events;

namespace Orders.Application.Messaging.Contracts;

public record ReleaseInventoryCommand(
    Guid OrderId,
    string ReservationId) : BaseIntegrationEvent;
