namespace Payment.Api.Models.Responses
{
    public record PaymentResponse(int Id, decimal Amount, string Currency, string PaymentMethod);
}