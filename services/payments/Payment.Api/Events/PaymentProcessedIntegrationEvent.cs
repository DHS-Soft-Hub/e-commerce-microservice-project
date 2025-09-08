using MediatR;

namespace Payment.Api.Events
{
    public record PaymentProcessedIntegrationEvent (
        Guid OrderId,
        Guid TransactionId,
        Guid PaymentId,
        decimal Price,
        string Currency,
        string Status,
        DateTime ProcessedAt
    ) : INotification;
    
}