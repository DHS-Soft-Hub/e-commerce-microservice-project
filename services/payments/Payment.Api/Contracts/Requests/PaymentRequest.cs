namespace Payment.Api.Contracts.Requests;
public record PaymentRequest(
    Guid OrderId,
    Guid CustomerId,
    decimal Price,
    string Currency,
    string PaymentMethod);
