
using MassTransit;
using Shared.Infrastructure.Messaging;
using Orders.Domain.Repositories;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Shared.Contracts.Orders.Events;
using Shared.Contracts.ShoppingCart.Events;
using Shared.Contracts.ShoppingCart.Responses;

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

        try
        {
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
                    await context.RespondAsync(new OrderCreatedResponse(
                        Guid.Empty,
                        false,
                        orderItemResults.Errors.ToString()
                    ));
                    return;
                }
            }

            // Save the order to the repository
            await _orderRepository.AddAsync(order.Value);

            // Respond with the generated OrderId
            await context.RespondAsync(new OrderCreatedResponse(
                order.Value.Id, // This is the database-generated ID
                true,
                string.Empty
            ));

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
        catch (Exception ex)
        {
            await context.RespondAsync(new OrderCreatedResponse(
                Guid.Empty,
                false,
                ex.Message
            ));
        }
    }
}