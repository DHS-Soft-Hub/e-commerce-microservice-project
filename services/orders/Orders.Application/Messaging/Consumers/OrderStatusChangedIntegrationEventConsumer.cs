using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Contracts.Orders.Events;
using Orders.Domain.Enums;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;

namespace Orders.Application.Messaging.Consumers;

public class OrderStatusChangedIntegrationEventConsumer : IConsumer<OrderStatusChangedIntegrationEvent>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<OrderStatusChangedIntegrationEventConsumer> _logger;

    public OrderStatusChangedIntegrationEventConsumer(
        IOrderRepository orderRepository,
        IUnitOfWork unitOfWork,
        ILogger<OrderStatusChangedIntegrationEventConsumer> logger)
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

            await _unitOfWork.BeginTransactionAsync(CancellationToken.None);

            var order = await _orderRepository.GetByIdAsync(new OrderId(@event.OrderId), context.CancellationToken);
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found", @event.OrderId);
                return;
            }
            
            var resultStatus = order.UpdateStatus(@event.Status);
            if (resultStatus.IsSuccess)
            {
                _logger.LogInformation("Order {OrderId} status updated to {Status}", @event.OrderId, @event.Status);
                await _unitOfWork.SaveChangesAsync(CancellationToken.None);
                await _unitOfWork.CommitTransactionAsync(CancellationToken.None);
            }
            else
            {
                _logger.LogWarning("Failed to update order {OrderId} status to {Status}", @event.OrderId, @event.Status);
                await _unitOfWork.RollbackTransactionAsync(CancellationToken.None);

            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId} status to {Status}", @event.OrderId, @event.Status);
            await _unitOfWork.RollbackTransactionAsync(CancellationToken.None);
        }
    }
}
