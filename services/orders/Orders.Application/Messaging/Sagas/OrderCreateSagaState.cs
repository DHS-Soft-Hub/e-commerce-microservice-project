using MassTransit;

namespace Orders.Application.Sagas
{
    public class OrderCreateSagaStateData : SagaStateMachineInstance
    {
        public Guid CorrelationId { get; set; }
        public string CurrentState { get; set; } = null!;
        public Guid OrderId { get; set; }
        public Guid CustomerId { get; set; }
        public decimal TotalPrice { get; set; }
        public string Currency { get; set; } = "USD";
        
        // Inventory Management
        public string? InventoryStatus { get; set; }
        public string? InventoryReservationId { get; set; }
        
        // Payment Management
        public string? PaymentStatus { get; set; }
        public Guid? PaymentId { get; set; }
        
        // Shipping Management
        public string? ShippingStatus { get; set; }
        public string? ShipmentId { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; }
        public DateTime? PaymentProcessedAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        
        // Retry and Error Handling
        public int RetryCount { get; set; }
        public string? LastError { get; set; }
    }
}