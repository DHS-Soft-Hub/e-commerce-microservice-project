using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Payment;

public record PaymentFailedIntegrationEvent(
    Guid OrderId,
    Guid? PaymentId,
    string Reason,
    DateTime FailedAt) : BaseIntegrationEvent;
