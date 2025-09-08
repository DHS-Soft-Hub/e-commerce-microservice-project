namespace Payment.Api.Models.Requests
{
    public record PaymentRequest(
        Guid OrderId,
        Guid CustomerId,
        decimal Price,
        string Currency,
        string PaymentMethod);
}