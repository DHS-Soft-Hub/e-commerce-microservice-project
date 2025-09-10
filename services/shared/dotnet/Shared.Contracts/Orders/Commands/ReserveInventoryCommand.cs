using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record ReserveInventoryCommand(
    Guid OrderId,
    Guid CustomerId,
    List<OrderItemRequest> Items) : BaseIntegrationEvent;

public record OrderItemRequest(
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice);
