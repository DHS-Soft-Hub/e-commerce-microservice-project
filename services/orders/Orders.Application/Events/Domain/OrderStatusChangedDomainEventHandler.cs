using MediatR;
using Orders.Domain.Events;
using Orders.Domain.Repositories;
using Shared.Contracts.Orders.Events;
using Shared.Domain.Interfaces;
using Shared.Infrastructure.Messaging;

namespace Orders.Application.Events.Domain;

public class OrderStatusChangedDomainEventHandler : INotificationHandler<OrderStatusChangedDomainEvent>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    private readonly IMessagePublisher _messagePublisher;

    public OrderStatusChangedDomainEventHandler(IOrderRepository orderRepository, IUnitOfWork unitOfWork, IMessagePublisher messagePublisher)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _messagePublisher = messagePublisher;
    }

    public async Task Handle(OrderStatusChangedDomainEvent notification, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(notification.OrderId, cancellationToken);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {notification.OrderId} not found.");
        }

        // Here you can implement any additional logic needed when the order status changes.
        // For example, logging, notifications, etc.

        // Raise an integration event if needed
        var integrationEvent = new OrderStatusChangedIntegrationEvent(notification.OrderId, notification.NewStatus, notification.Reason);
        await _messagePublisher.PublishAsync(integrationEvent);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}