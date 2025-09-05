using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ReleaseInventoryCommand(
    Guid OrderId,
    string ReservationId) : BaseIntegrationEvent;
