using MassTransit;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Inventory.Events;

namespace Orders.Application.Messaging.Consumers;

/// <summary>
/// Mock consumer to simulate inventory service responses
/// This will be replaced by actual inventory service
/// </summary>
public class MockInventoryConsumer : 
    IConsumer<ReserveInventoryCommand>,
    IConsumer<ReleaseInventoryCommand>
{
    public async Task Consume(ConsumeContext<ReserveInventoryCommand> context)
    {
        var command = context.Message;
        
        // Simulate processing delay
        await Task.Delay(1000);
        
        // Simulate success 90% of the time
        var isSuccess = Random.Shared.Next(1, 11) <= 9;
        
        if (isSuccess)
        {
            // Simulate successful inventory reservation
            var reservedEvent = new InventoryReservedIntegrationEvent(
                command.OrderId,
                Guid.NewGuid().ToString(), // Mock reservation ID
                "Reserved",
                DateTime.UtcNow
            );
            
            await context.Publish(reservedEvent);
            Console.WriteLine($"🟢 Mock Inventory: Reserved inventory for Order {command.OrderId}");
        }
        else
        {
            // Simulate inventory reservation failure
            var failedEvent = new InventoryReservationFailedIntegrationEvent(
                command.OrderId,
                "Insufficient stock for one or more items",
                DateTime.UtcNow
            );
            
            await context.Publish(failedEvent);
            Console.WriteLine($"🔴 Mock Inventory: Failed to reserve inventory for Order {command.OrderId} - Insufficient stock");
        }
    }

    public async Task Consume(ConsumeContext<ReleaseInventoryCommand> context)
    {
        var command = context.Message;
        
        // Simulate processing delay
        await Task.Delay(500);
        
        Console.WriteLine($"🟡 Mock Inventory: Released inventory reservation {command.ReservationId} for Order {command.OrderId}");
        
        // In a real system, you might publish an InventoryReleasedIntegrationEvent
        // For now, we'll just log it
    }
}
