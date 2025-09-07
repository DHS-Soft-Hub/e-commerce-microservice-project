using Shared.Domain.Events;

namespace Orders.Application.Events.Integration.Payment;

public record PaymentProcessedIntegrationEvent (
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string Status,
    DateTime ProcessedAt
) : BaseIntegrationEvent;
