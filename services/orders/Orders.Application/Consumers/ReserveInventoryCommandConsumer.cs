using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Application.Events;

namespace Orders.Application.Consumers;

public class ReserveInventoryCommandConsumer : IConsumer<ReserveInventoryCommand>
{
    private readonly ILogger<ReserveInventoryCommandConsumer> _logger;

    public ReserveInventoryCommandConsumer(ILogger<ReserveInventoryCommandConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ReserveInventoryCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("Processing inventory reservation for order {OrderId}", command.OrderId);

        try
        {
            // Simulate inventory check and reservation
            await Task.Delay(1000); // Simulate processing time

            // Simulate 90% success rate
            var random = new Random();
            var success = random.NextDouble() > 0.1; // 90% success rate

            if (success)
            {
                var reservationId = Guid.NewGuid().ToString();
                _logger.LogInformation("Inventory reserved successfully for order {OrderId}, reservation {ReservationId}", 
                    command.OrderId, reservationId);

                await context.Publish(new InventoryReservedIntegrationEvent(
                    command.OrderId,
                    reservationId,
                    "Reserved",
                    DateTime.UtcNow
                ));
            }
            else
            {
                _logger.LogWarning("Inventory reservation failed for order {OrderId}", command.OrderId);

                await context.Publish(new InventoryReservationFailedIntegrationEvent(
                    command.OrderId,
                    "Insufficient stock",
                    DateTime.UtcNow
                ));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing inventory reservation for order {OrderId}", command.OrderId);

            await context.Publish(new InventoryReservationFailedIntegrationEvent(
                command.OrderId,
                $"System error: {ex.Message}",
                DateTime.UtcNow
            ));
        }
    }
}
