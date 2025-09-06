using Orders.Application.DTOs;
using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Order;

public record OrderCreatedIntegrationEvent (
    Guid OrderId,
    Guid CustomerId,
    decimal TotalPrice,
    string Currency,
    List<OrderItemDto> Items) : BaseIntegrationEvent;