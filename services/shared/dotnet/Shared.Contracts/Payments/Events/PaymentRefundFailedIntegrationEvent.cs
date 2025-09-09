using Shared.Domain.Events;

namespace Shared.Contracts.Payments.Events;

public record PaymentRefundFailedIntegrationEvent(
    Guid OrderId,
    Guid PaymentId,
    string ErrorMessage,
    DateTime FailedAt) : BaseIntegrationEvent;
