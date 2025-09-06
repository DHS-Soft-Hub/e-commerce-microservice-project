using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Events;
using Shared.Infrastructure.Messaging;

namespace Orders.Application.Events
{
    public class OrderCreatedDomainEventHandler : INotificationHandler<OrderCreatedDomainEvent>
    {

        private readonly IMessagePublisher _messagePublisher;

        public OrderCreatedDomainEventHandler(IMessagePublisher messagePublisher)
        {
            _messagePublisher = messagePublisher;
        }

        public async Task Handle(OrderCreatedDomainEvent notification, CancellationToken cancellationToken)
        {
            // Publish integration event
            var orderCreatedIntegrationEvent = new OrderCreatedIntegrationEvent
            (
                notification.OrderId.Value,
                notification.CustomerId.Value,
                notification.TotalPrice,
                "USD", // Default currency
                notification.Items.Select(item => new OrderItemDto
                {
                    Id = item.Id.Value,
                    ProductId = item.ProductId.Value,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Currency = item.Currency
                }).ToList()
            );

            await _messagePublisher.PublishAsync(orderCreatedIntegrationEvent, cancellationToken);
        }
    }
}