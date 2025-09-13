using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record ReserveInventoryCommand(
    Guid OrderId,
    Guid CustomerId,
    List<OrderItemRequest> Items) : BaseIntegrationEvent;


