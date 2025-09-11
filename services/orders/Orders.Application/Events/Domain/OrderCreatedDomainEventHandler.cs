using MediatR;
using Shared.Contracts.Orders.Models;
using Orders.Domain.Events;
using Shared.Infrastructure.Messaging;
using Shared.Contracts.Orders.Events;


namespace Orders.Application.Events.Domain
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
                notification.Currency,
                notification.Items.Select(item => new OrderItemCheckedOutDto
                {
                    Id = item.Id.Value,
                    ProductId = item.ProductId.Value,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice.Amount,
                    Currency = item.UnitPrice.Currency
                }).ToList()
            );

            await _messagePublisher.PublishAsync(orderCreatedIntegrationEvent, cancellationToken);
        }
    }
}