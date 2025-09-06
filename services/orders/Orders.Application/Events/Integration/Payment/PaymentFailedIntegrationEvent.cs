using Shared.Domain.Events;

namespace Orders.Application.Events;

public record PaymentFailedIntegrationEvent(
    Guid OrderId,
    Guid? PaymentId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
