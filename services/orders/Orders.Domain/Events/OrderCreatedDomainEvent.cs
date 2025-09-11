using Orders.Domain.Entities;
using Orders.Domain.Enums;
using Orders.Domain.ValueObjects;
using Shared.Domain.Events;

namespace Orders.Domain.Events;

public sealed record OrderCreatedDomainEvent(
    OrderId OrderId,
    CustomerId CustomerId,
    OrderStatus Status,
    decimal TotalPrice,
    string Currency,
    List<OrderItem> Items) : IDomainEvent;
