using Shared.Domain.Events;

namespace Orders.Domain.Events;

public record OrderStatusChangedDomainEvent(Guid OrderId, string NewStatus, string Reason) : IDomainEvent;