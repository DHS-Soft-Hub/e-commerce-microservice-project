using Shared.Domain.Events;

namespace Orders.Application.Events;

public record RefundPaymentCommand(
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Reason) : BaseIntegrationEvent;
