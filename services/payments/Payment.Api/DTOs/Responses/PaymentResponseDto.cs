namespace Payment.Api.DTOs.Responses;

public record PaymentResponseDto(
    string Id,
    string OrderId,
    string TransactionId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt);