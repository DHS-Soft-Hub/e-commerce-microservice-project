using MassTransit;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Shipment.Events;
using Shared.Contracts.Orders.Events;

namespace Orders.Application.Messaging.Consumers;

/// <summary>
/// Mock consumer to simulate shipping service responses
/// This will be replaced by actual shipping service
/// </summary>
public class MockShippingConsumer : IConsumer<CreateShipmentCommand>
{
    public async Task Consume(ConsumeContext<CreateShipmentCommand> context)
    {
        var command = context.Message;
        
        // Simulate processing delay
        await Task.Delay(1500);
        
        // Simulate success 98% of the time
        var isSuccess = Random.Shared.Next(1, 51) <= 49;
        
        if (isSuccess)
        {
            // Simulate successful shipment creation
            var shipmentId = $"SHIP-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
            
            var createdEvent = new ShipmentCreatedIntegrationEvent(
                command.OrderId,
                shipmentId,
                "Created",
                DateTime.UtcNow
            );
            
            await context.Publish(createdEvent);
            Console.WriteLine($"📦 Mock Shipping: Created shipment {shipmentId} for Order {command.OrderId}");
            
            // NOTE: Removed automatic shipping and delivery simulation
            // The saga will now wait in the "Shipped" state until manual delivery events
            Console.WriteLine($"� Mock Shipping: Shipment {shipmentId} created but not automatically shipped/delivered");
        }
        else
        {
            // Simulate shipment failure
            var failedEvent = new ShipmentFailedIntegrationEvent(
                command.OrderId,
                "Unable to create shipment - Invalid shipping address",
                DateTime.UtcNow
            );
            
            await context.Publish(failedEvent);
            Console.WriteLine($"❌ Mock Shipping: Failed to create shipment for Order {command.OrderId} - Invalid address");
        }
    }
}
