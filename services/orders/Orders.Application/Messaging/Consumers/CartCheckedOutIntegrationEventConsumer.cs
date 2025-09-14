
using MassTransit;
using Shared.Infrastructure.Messaging;
using Orders.Domain.Repositories;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Orders.Domain.ValueObjects;
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
            // Validate required data
            if (@event.UserId == null)
            {
                await context.RespondAsync(new OrderCreatedResponse(
                    Guid.Empty,
                    false,
                    "User ID is required for order creation"
                ));
                return;
            }

            // Create the order
            var orderResult = Order.Create(
                new CustomerId(@event.UserId.Value),
                @event.Currency
            );

            if (orderResult.IsFailure)
            {
                await context.RespondAsync(new OrderCreatedResponse(
                    Guid.Empty,
                    false,
                    orderResult.Errors.ToString()
                ));
                return;
            }

            var order = orderResult.Value;

            foreach (var item in @event.Items)
            {
                var itemResult = OrderItem.Create(
                    new ProductId(item.ProductId),
                    item.ProductName,
                    item.Quantity,
                    new Shared.Domain.ValueObjects.Money(item.UnitPrice, item.Currency)
                );

                if (itemResult.IsFailure)
                {
                    // Handle failure (e.g., log, throw, etc.)
                    throw new InvalidOperationException(itemResult.Errors.ToString());
                }

                var orderItemResults = order.AddItem(itemResult.Value);

                if (orderItemResults.IsFailure)
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
            await _orderRepository.AddAsync(order);

            // Respond with the generated OrderId
            await context.RespondAsync(new OrderCreatedResponse(
                order.Id.Value, 
                true,
                string.Empty
            ));

            // Publish OrderCreatedIntegrationEvent
            var orderCreatedIntegrationEvent = new OrderCreatedIntegrationEvent(
                order.Id.Value, 
                order.CustomerId.Value, 
                order.TotalPrice.Amount,
                order.TotalPrice.Currency,
                order.Items.Select(item => new OrderItemResponseDto(
                    item.Id.Value, 
                    item.ProductId.Value, 
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