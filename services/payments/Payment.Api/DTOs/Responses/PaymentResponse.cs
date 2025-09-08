namespace Payment.Api.DTOs.Responses;

public record PaymentResponse(
    string Id,
    string OrderId,
    string TransactionId,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string Status);