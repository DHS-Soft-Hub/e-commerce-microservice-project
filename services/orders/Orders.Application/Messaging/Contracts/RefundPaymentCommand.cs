using Shared.Domain.Events;

namespace Orders.Application.Messaging.Contracts;

public record RefundPaymentCommand(
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Reason) : BaseIntegrationEvent;
