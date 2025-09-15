using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record ReserveInventoryCommand(
    Guid OrderId,
    Guid CustomerId,
    List<InventoryItemRequest> Items) : BaseIntegrationEvent;


public record InventoryItemRequest(
    Guid ProductId,
    int Quantity);