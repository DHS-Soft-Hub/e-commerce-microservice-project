using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Payment;

public record PaymentRefundFailedIntegrationEvent(
    Guid OrderId,
    Guid PaymentId,
    string ErrorMessage,
    DateTime FailedAt) : BaseIntegrationEvent;
