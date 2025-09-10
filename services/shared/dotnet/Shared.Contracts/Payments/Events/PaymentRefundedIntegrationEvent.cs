using Shared.Domain.Events;

namespace Shared.Contracts.Payments.Events;

public record PaymentRefundedIntegrationEvent(
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Status,
    DateTime RefundedAt) : BaseIntegrationEvent;
