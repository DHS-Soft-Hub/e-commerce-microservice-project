namespace Shared.Contracts.Orders.Events;

public class OrderShippedIntegrationEvent
{
    public Guid OrderId { get; set; }
    public string ShipmentId { get; set; }
    public DateTime ShippedDate { get; set; }
}