using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Application.Events;

namespace Orders.Application.Consumers;

public class RefundPaymentCommandConsumer : IConsumer<RefundPaymentCommand>
{
    private readonly ILogger<RefundPaymentCommandConsumer> _logger;

    public RefundPaymentCommandConsumer(ILogger<RefundPaymentCommandConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<RefundPaymentCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("Processing payment refund for order {OrderId}, payment {PaymentId}", 
            command.OrderId, command.PaymentId);

        try
        {
            // Simulate payment refund process
            await Task.Delay(800); // Simulate processing time

            _logger.LogInformation("Payment refunded successfully for order {OrderId}, payment {PaymentId}", 
                command.OrderId, command.PaymentId);

            await context.Publish(new PaymentRefundedIntegrationEvent(
                command.OrderId,
                command.PaymentId,
                command.Amount,
                "Refunded",
                DateTime.UtcNow
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refunding payment for order {OrderId}, payment {PaymentId}", 
                command.OrderId, command.PaymentId);

            await context.Publish(new PaymentRefundFailedIntegrationEvent(
                command.OrderId,
                command.PaymentId,
                $"Refund failed: {ex.Message}",
                DateTime.UtcNow
            ));
        }
    }
}
