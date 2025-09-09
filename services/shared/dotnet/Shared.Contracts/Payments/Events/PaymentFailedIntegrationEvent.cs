using Shared.Domain.Events;

namespace Shared.Contracts.Payments.Events;

public record PaymentFailedIntegrationEvent(
    Guid OrderId,
    Guid? PaymentId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
