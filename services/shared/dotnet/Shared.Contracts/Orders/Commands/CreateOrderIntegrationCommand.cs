namespace Shared.Contracts.Orders.Commands;

using Shared.Domain.Events;
public record CreateOrderIntegrationCommand(
    Guid UserId,
    string SessionId,
    List<OrderItemRequest> Items,
    string Currency
) : BaseIntegrationEvent;

public record OrderItemRequest(
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    string Currency);