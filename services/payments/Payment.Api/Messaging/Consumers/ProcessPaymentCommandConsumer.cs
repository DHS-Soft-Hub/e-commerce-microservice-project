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
                Status = PaymentStatus.Completed,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddPaymentAsync(payment);

            await context.Publish(new PaymentProcessedIntegrationEvent(
                OrderId: payment.OrderId,
                PaymentId: payment.Id,
                Amount: payment.Price,
                Currency: payment.Currency,
                PaymentMethod: payment.PaymentMethod.ToString(),
                Status: payment.Status.ToString(),
                ProcessedAt: payment.CreatedAt
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Payment processing failed for Order {OrderId}", msg.OrderId);
            await context.Publish(new PaymentFailedIntegrationEvent(
                OrderId: msg.OrderId,
                PaymentId: null,
                Reason: ex.Message,
                FailedAt: DateTime.UtcNow
            ));
        }
    }
}
