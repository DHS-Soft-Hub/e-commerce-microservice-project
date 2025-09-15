using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Events;

public record OrderCreatedIntegrationEvent (
    Guid Id,
    Guid CustomerId,
    decimal TotalPrice,
    string Currency,
    List<OrderItemResponseDto> Items) : BaseIntegrationEvent;

public record OrderItemResponseDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    string Currency);