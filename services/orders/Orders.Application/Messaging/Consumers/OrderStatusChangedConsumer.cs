using MassTransit;
using Microsoft.Extensions.Logging;
using Orders.Application.Events.Integration.Order;
using Orders.Domain.Enums;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;

namespace Orders.Application.Messaging.Consumers;

public class OrderStatusChangedConsumer : IConsumer<OrderStatusChangedIntegrationEvent>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<OrderStatusChangedConsumer> _logger;

    public OrderStatusChangedConsumer(
        IOrderRepository orderRepository,
        IUnitOfWork unitOfWork,
        ILogger<OrderStatusChangedConsumer> logger)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<OrderStatusChangedIntegrationEvent> context)
    {
        var @event = context.Message;
        _logger.LogInformation("Updating order {OrderId} status to {Status}", @event.OrderId, @event.Status);

        try
        {
            var order = await _orderRepository.GetByIdAsync(new OrderId(@event.OrderId));
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found", @event.OrderId);
                return;
            }

            // Parse the status string to OrderStatus enum
            if (Enum.TryParse<OrderStatus>(@event.Status, out var newStatus))
            {
                order.UpdateStatus(newStatus);

                await _unitOfWork.BeginTransactionAsync(CancellationToken.None);
                await _unitOfWork.SaveChangesAsync(CancellationToken.None);
                await _unitOfWork.CommitTransactionAsync(CancellationToken.None);

                _logger.LogInformation("Order {OrderId} status updated to {Status}", @event.OrderId, @event.Status);
            }
            else
            {
                _logger.LogWarning("Invalid status {Status} for order {OrderId}", @event.Status, @event.OrderId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId} status to {Status}", @event.OrderId, @event.Status);
            await _unitOfWork.RollbackTransactionAsync(CancellationToken.None);
        }
    }
}
