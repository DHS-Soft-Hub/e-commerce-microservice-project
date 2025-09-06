using Shared.Domain.Events;

namespace Orders.Application.Messaging.Contracts;

public record ProcessPaymentCommand(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    string Currency,
    string PaymentMethod) : BaseIntegrationEvent;
