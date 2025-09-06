using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Application.Events.Integration.Inventory;
using Orders.Application.Messaging.Contracts;

namespace Orders.Application.Messaging.Consumers;

public class ReleaseInventoryCommandConsumer : IConsumer<ReleaseInventoryCommand>
{
    private readonly ILogger<ReleaseInventoryCommandConsumer> _logger;

    public ReleaseInventoryCommandConsumer(ILogger<ReleaseInventoryCommandConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ReleaseInventoryCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("Processing inventory release for order {OrderId}, reservation {ReservationId}", 
            command.OrderId, command.ReservationId);

        try
        {
            // Simulate inventory release process
            await Task.Delay(500); // Simulate processing time

            _logger.LogInformation("Inventory released successfully for order {OrderId}, reservation {ReservationId}", 
                command.OrderId, command.ReservationId);

            await context.Publish(new InventoryReleasedIntegrationEvent(
                command.OrderId,
                command.ReservationId,
                "Released",
                DateTime.UtcNow
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error releasing inventory for order {OrderId}, reservation {ReservationId}", 
                command.OrderId, command.ReservationId);

            // Even if release fails, we should continue the compensation flow
            await context.Publish(new InventoryReleasedIntegrationEvent(
                command.OrderId,
                command.ReservationId,
                "Released",
                DateTime.UtcNow
            ));
        }
    }
}
