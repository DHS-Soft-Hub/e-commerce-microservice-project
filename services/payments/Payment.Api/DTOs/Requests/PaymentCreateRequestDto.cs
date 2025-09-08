namespace Payment.Api.DTOs.Requests;
public record PaymentCreateRequestDto(
    Guid OrderId,
    string TransactionId,
    decimal Price,
    string Currency,
    string PaymentMethod);
