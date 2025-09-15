
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

            // Finalize the order - this will raise the OrderCreatedDomainEvent
            var finalizeResult = order.FinalizeOrder();
            if (finalizeResult.IsFailure)
            {
                await context.RespondAsync(new OrderCreatedResponse(
                    Guid.Empty,
                    false,
                    finalizeResult.Errors.ToString()
                ));
                return;
            }

            // Save the order again to persist domain events
            await _orderRepository.UpdateAsync(order);

            // Respond with the generated OrderId
            await context.RespondAsync(new OrderCreatedResponse(
                order.Id.Value, 
                true,
                string.Empty
            ));

            // Note: OrderCreatedIntegrationEvent will be published by OrderCreatedDomainEventHandler
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