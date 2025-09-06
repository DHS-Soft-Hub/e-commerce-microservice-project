using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ReserveInventoryCommand(
    Guid OrderId,
    Guid CustomerId,
    List<OrderItemRequest> Items) : BaseIntegrationEvent;

public record OrderItemRequest(
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice);
