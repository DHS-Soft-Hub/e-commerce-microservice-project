namespace Orders.Domain.Enums
{
    public enum OrderStatus
    {
        Draft,
        Pending,
        InventoryReserving,
        InventoryReserved,
        ProcessingPayment,
        Paid,
        CreatingShipment,
        Shipped,
        Delivered,
        Completed,
        Cancelled,
        Failed
    }
}