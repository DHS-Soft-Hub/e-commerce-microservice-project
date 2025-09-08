namespace Payment.Api.Contracts.Responses;

public record PaymentResponse(
    int Id,
    decimal Amount,
    string Currency,
    string PaymentMethod);