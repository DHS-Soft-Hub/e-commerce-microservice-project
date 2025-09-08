namespace Payment.Api.Contracts.Requests;
public record PaymentRequest(
    Guid OrderId,
    string TransactionId,
    decimal Price,
    string Currency,
    string PaymentMethod);
