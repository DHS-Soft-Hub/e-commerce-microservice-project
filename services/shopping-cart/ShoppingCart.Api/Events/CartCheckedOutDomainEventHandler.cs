using MediatR;
using Shared.Contracts.ShoppingCart.Events;

namespace ShoppingCart.Api.Events;

public class CartCheckedOutDomainEventHandler : INotificationHandler<CartCheckedOutDomainEvent>
{
    public Task Handle(CartCheckedOutDomainEvent domainEvent, CancellationToken cancellationToken)
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
        
        return Task.CompletedTask;
    }
}