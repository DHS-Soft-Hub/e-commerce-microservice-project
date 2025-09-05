using Shared.Domain.Events;

namespace Orders.Application.Events;

public record ProcessPaymentCommand(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    string Currency,
    string PaymentMethod) : BaseIntegrationEvent;
