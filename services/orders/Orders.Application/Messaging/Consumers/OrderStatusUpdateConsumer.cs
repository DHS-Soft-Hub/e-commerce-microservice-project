using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Contracts.Orders.Events;

namespace Orders.Application.Messaging.Consumers;

public class OrderStatusUpdateConsumer : IConsumer<OrderStatusChangedIntegrationEvent>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<OrderStatusUpdateConsumer> _logger;

    public OrderStatusUpdateConsumer(IOrderRepository orderRepository, ILogger<OrderStatusUpdateConsumer> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedIntegrationEvent> context)
    {
        var message = context.Message;

        try
        {
            var orderId = new OrderId(message.OrderId);

            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("Order not found: {OrderId}", message.OrderId);
                return;
            }

            // Update status without raising domain events to avoid circular references
            var result = order.UpdateStatus(message.Status, raiseEvent: false);
            if (result.IsFailure)
            {
                _logger.LogError("Failed to update order status for {OrderId}: {Errors}", 
                    message.OrderId, string.Join(", ", result.Errors));
                return;
            }

            await _orderRepository.UpdateAsync(order);

            _logger.LogInformation("Order {OrderId} status updated to {Status}: {Reason}", 
                message.OrderId, message.Status, message.Reason);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status for {OrderId}", message.OrderId);
            throw; // Let MassTransit handle the retry/error handling
        }
    }
}
