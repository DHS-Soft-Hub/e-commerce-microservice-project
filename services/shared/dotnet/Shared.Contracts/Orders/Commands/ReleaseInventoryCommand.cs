using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record ReleaseInventoryCommand(
    Guid OrderId,
    string ReservationId) : BaseIntegrationEvent;
