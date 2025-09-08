namespace Payment.Api.Contracts.Responses;

public record PaymentResponse(
    string Id,
    decimal Amount,
    string Currency,
    string PaymentMethod,
    string Status);