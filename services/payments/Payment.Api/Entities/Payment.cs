using Payment.Api.Enums;

namespace Payment.Api.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid CustomerId { get; set; }
    public string TransactionId { get; set; } = null!;
    public PaymentStatus Status { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = null!;
    public PaymentMethods PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}