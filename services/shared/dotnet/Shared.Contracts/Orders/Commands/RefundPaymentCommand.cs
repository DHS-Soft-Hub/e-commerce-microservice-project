using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record RefundPaymentCommand(
    Guid OrderId,
    Guid PaymentId,
    decimal Amount,
    string Reason) : BaseIntegrationEvent;
