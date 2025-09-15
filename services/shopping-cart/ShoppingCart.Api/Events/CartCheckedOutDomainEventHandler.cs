using MediatR;
using MassTransit;
using Shared.Contracts.ShoppingCart.Events;
using Shared.Infrastructure.Messaging;

namespace ShoppingCart.Api.Events;

public class CartCheckedOutDomainEventHandler : INotificationHandler<CartCheckedOutDomainEvent>
{
    private readonly IMessagePublisher _messagePublisher;
    public CartCheckedOutDomainEventHandler(IMessagePublisher messagePublisher)
    {
        _messagePublisher = messagePublisher;
    }

    public async Task Handle(CartCheckedOutDomainEvent domainEvent, CancellationToken cancellationToken)
    {
        // Handle the event (e.g., update projections, send notifications, etc.)

        // Raise CheckoutCompleted event to Order service via messaging (e.g., RabbitMQ, Kafka, etc.)
        var checkoutCompletedEvent = new CartCheckedOutIntegrationEvent(
            domainEvent.CartId,
            domainEvent.UserId ?? Guid.Empty,
            domainEvent.SessionId ?? string.Empty,
            domainEvent.CartItems.Select(item => new CartItemCheckedOutDto
            (
                item.Id,
                item.ProductId,
                item.ProductName,
                item.Quantity,
                item.UnitPrice,
                item.Currency
            )).ToList(),
            domainEvent.TotalAmount,
            domainEvent.Currency,
            domainEvent.CheckedOutAt);

        // Publish the event to the message bus (implementation depends on your messaging infrastructure)
        await _messagePublisher.PublishAsync(checkoutCompletedEvent);
    }
}