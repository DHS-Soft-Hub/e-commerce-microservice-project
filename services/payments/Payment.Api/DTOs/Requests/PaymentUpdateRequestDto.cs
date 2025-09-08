namespace Payment.Api.DTOs.Requests;
public record PaymentUpdateRequestDto(
    Guid Id,
    Guid OrderId,
    string TransactionId,
    decimal Price,
    string Currency,
    string PaymentMethod,
    string Status);
