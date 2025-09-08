namespace Payment.Api.DTOs.Requests;
public record PaymentCreateRequest(
    Guid OrderId,
    string TransactionId,
    decimal Price,
    string Currency,
    string PaymentMethod);
