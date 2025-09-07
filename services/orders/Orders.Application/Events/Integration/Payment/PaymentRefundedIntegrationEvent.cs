using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Payment;

public record PaymentRefundedIntegrationEvent(
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Status,
    DateTime RefundedAt) : BaseIntegrationEvent;
