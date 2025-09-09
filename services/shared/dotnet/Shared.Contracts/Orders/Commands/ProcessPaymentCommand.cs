using Shared.Domain.Events;

namespace Shared.Contracts.Orders.Commands;

public record ProcessPaymentCommand(
    Guid OrderId,
    Guid CustomerId,
    decimal Amount,
    string Currency,
    string PaymentMethod) : BaseIntegrationEvent;
