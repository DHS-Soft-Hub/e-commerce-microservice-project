using Shared.Domain.Events;

namespace Shared.Contracts.Payments.Events;

public record PaymentProcessedIntegrationEvent (
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string Status,
    DateTime ProcessedAt
) : BaseIntegrationEvent;
