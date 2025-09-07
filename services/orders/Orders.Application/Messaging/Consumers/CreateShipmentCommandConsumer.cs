using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Application.Events.Integration.Shipment;
using Orders.Application.Messaging.Contracts;

namespace Orders.Application.Messaging.Consumers;

public class CreateShipmentCommandConsumer : IConsumer<CreateShipmentCommand>
{
    private readonly ILogger<CreateShipmentCommandConsumer> _logger;

    public CreateShipmentCommandConsumer(ILogger<CreateShipmentCommandConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<CreateShipmentCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("Processing shipment creation for order {OrderId}", command.OrderId);

        try
        {
            // Simulate shipment creation process
            await Task.Delay(1500); // Simulate processing time

            // Simulate 95% success rate
            var random = new Random();
            var success = random.NextDouble() > 0.05; // 95% success rate

            if (success)
            {
                var shipmentId = $"SHIP-{Guid.NewGuid().ToString()[..8].ToUpper()}";
                _logger.LogInformation("Shipment created successfully for order {OrderId}, shipment {ShipmentId}", 
                    command.OrderId, shipmentId);

                await context.Publish(new ShipmentCreatedIntegrationEvent(
                    command.OrderId,
                    shipmentId,
                    "Created",
                    DateTime.UtcNow
                ));

                // Simulate shipment processing and delivery after a delay
                _ = Task.Run(async () =>
                {
                    await Task.Delay(5000); // Simulate shipping time
                    
                    _logger.LogInformation("Shipment {ShipmentId} for order {OrderId} has been delivered", 
                        shipmentId, command.OrderId);

                    await context.Publish(new ShipmentDeliveredIntegrationEvent(
                        command.OrderId,
                        shipmentId,
                        "Delivered",
                        DateTime.UtcNow
                    ));
                });
            }
            else
            {
                _logger.LogWarning("Shipment creation failed for order {OrderId}", command.OrderId);

                await context.Publish(new ShipmentFailedIntegrationEvent(
                    command.OrderId,
                    "Unable to create shipment - carrier unavailable",
                    DateTime.UtcNow
                ));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing shipment creation for order {OrderId}", command.OrderId);

            await context.Publish(new ShipmentFailedIntegrationEvent(
                command.OrderId,
                $"System error: {ex.Message}",
                DateTime.UtcNow
            ));
        }
    }
}
