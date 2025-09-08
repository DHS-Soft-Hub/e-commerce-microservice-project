namespace Payment.Api.Models.Entities
{
    public class Payment
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}