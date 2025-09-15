using MassTransit;
using Payment.Api.Data.Repositories;
using Payment.Api.Enums;
using Shared.Contracts.Orders.Commands;
using Shared.Contracts.Payments.Events;

namespace Payment.Api.Messaging.Consumers;

public class ProcessPaymentCommandConsumer : IConsumer<ProcessPaymentCommand>
{
    private readonly IPaymentRepository _repository;
    private readonly ILogger<ProcessPaymentCommandConsumer> _logger;

    public ProcessPaymentCommandConsumer(IPaymentRepository repository, ILogger<ProcessPaymentCommandConsumer> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ProcessPaymentCommand> context)
    {
        var msg = context.Message;
        try
        {
            var payment = new Payment.Api.Entities.Payment
            {
                Id = Guid.NewGuid(),
                OrderId = msg.OrderId,
                TransactionId = Guid.NewGuid().ToString(),
                Price = msg.Amount,
                Currency = msg.Currency,
                PaymentMethod = Enum.Parse<PaymentMethods>(msg.PaymentMethod, true),
                Status = PaymentStatus.Pending, // Keep as Pending - require manual approval
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddPaymentAsync(payment);

            _logger.LogInformation("💳 Payment created and waiting for approval - Order: {OrderId}, Payment: {PaymentId}, Amount: {Amount}", 
                payment.OrderId, payment.Id, payment.Price);

            // Do NOT publish PaymentProcessedIntegrationEvent here
            // Payment should remain pending until manually approved
            // The PaymentProcessedIntegrationEvent will be published when payment is manually approved via API
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Payment creation failed for Order {OrderId}", msg.OrderId);
            await context.Publish(new PaymentFailedIntegrationEvent(
                OrderId: msg.OrderId,
                PaymentId: null,
                Reason: ex.Message,
                FailedAt: DateTime.UtcNow
            ));
        }
    }
}
