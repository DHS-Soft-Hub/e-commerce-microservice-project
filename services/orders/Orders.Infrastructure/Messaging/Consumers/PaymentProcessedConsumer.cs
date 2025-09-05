// using MassTransit;
// using MediatR;
// using Microsoft.Extensions.Logging;
// using Payment.Api.Events; // Cross-service event

// namespace Orders.Infrastructure.Messaging.Consumers
// {
//     public class PaymentProcessedConsumer : IConsumer<PaymentProcessedIntegrationEvent>
//     {
//         private readonly ILogger<PaymentProcessedConsumer> _logger;
//         // Inject your application services here

//         public PaymentProcessedConsumer(ILogger<PaymentProcessedConsumer> logger)
//         {
//             _logger = logger;
//         }

//         public async Task Consume(ConsumeContext<PaymentProcessedIntegrationEvent> context)
//         {
//             _logger.LogInformation("Processing payment completed for Order: {OrderId}",
//                 context.Message.OrderId);

//             // Handle the event - update order status, send notifications, etc.
//         }
//     }
// }