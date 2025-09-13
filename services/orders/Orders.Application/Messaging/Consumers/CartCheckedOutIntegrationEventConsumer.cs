
using MassTransit;
using Shared.Contracts.Orders.Commands;
using Shared.Infrastructure.Messaging;
using Orders.Domain.Repositories;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.ShoppingCart.Events;

namespace Orders.Application.Messaging.Consumers;

public class CartCheckedOutIntegrationEventConsumer : IConsumer<CartCheckedOutIntegrationEvent>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMessagePublisher _messagePublisher;

    public CartCheckedOutIntegrationEventConsumer(IOrderRepository orderRepository, IMessagePublisher messagePublisher)
    {
        _orderRepository = orderRepository;
        _messagePublisher = messagePublisher;
    }

    public async Task Consume(ConsumeContext<CartCheckedOutIntegrationEvent> context)
    {
        var @event = context.Message;

        // Create the order
        var order = Order.Create(
            @event.UserId,
            @event.Currency
        );

        foreach (var item in @event.Items)
        {
            var itemResult = OrderItem.Create(
                order.Value.Id,
                item.ProductId,
                item.ProductName,
                item.Quantity,
                new Shared.Domain.ValueObjects.Money(item.UnitPrice, item.Currency)
            );

            if (!itemResult.IsFailure)
            {
                // Handle failure (e.g., log, throw, etc.)
                throw new InvalidOperationException(itemResult.Errors.ToString());
            }

            var orderItemResults = order.Value.AddItem(itemResult.Value);

            if (!orderItemResults.IsSuccess)
            {
                // Handle failure (e.g., log, throw, etc.)
                throw new InvalidOperationException(orderItemResults.Errors.ToString());
            }
        }

        await _orderRepository.AddAsync(order.Value);

        // Publish OrderCreatedIntegrationEvent
        var orderCreatedIntegrationEvent = new OrderCreatedIntegrationEvent(
            order.Value.Id,
            order.Value.CustomerId,
            order.Value.TotalPrice.Amount,
            order.Value.TotalPrice.Currency,
            order.Value.Items.Select(item => new OrderItemResponseDto(
                item.Id,
                item.ProductId,
                item.ProductName,
                item.Quantity,
                item.UnitPrice.Amount,
                item.UnitPrice.Currency
            )).ToList()
        );

        await _messagePublisher.PublishAsync(orderCreatedIntegrationEvent, context.CancellationToken);
    }
}