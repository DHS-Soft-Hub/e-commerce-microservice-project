using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Contracts.Responses;
using Shared.Contracts.ShoppingCart.Events;
using Shared.Contracts.ShoppingCart.Responses;
using MassTransit;
using MassTransit.Testing;

namespace ShoppingCart.Api.Commands.PrepareCheckoutCommand;

public class PrepareCheckoutCommandHandler : IRequestHandler<PrepareCheckoutCommand, CheckoutResultResponse>
{
    private readonly ICartRepository _cartRepository;
    private readonly IRequestClient<CartCheckedOutIntegrationEvent> _requestClient;

    public PrepareCheckoutCommandHandler(ICartRepository cartRepository, IRequestClient<CartCheckedOutIntegrationEvent> requestClient)
    {
        _cartRepository = cartRepository;
        _requestClient = requestClient;
    }

    public async Task<CheckoutResultResponse> Handle(PrepareCheckoutCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserOrSessionAsync(request.UserId, request.SessionId);
        if (cart == null)
        {
            throw new InvalidOperationException($"Cart not found for user {request.UserId}");
        }

        if (!cart.Items.Any())
        {
            throw new InvalidOperationException("Cannot checkout with empty cart");
        }

        // Create checkout event
        var checkoutEvent = new CartCheckedOutIntegrationEvent(
            cart.Id,
            request.UserId,
            request.SessionId,
            cart.Items.Select(i => new CartItemCheckedOutDto(
                i.Id,
                i.ProductId,
                i.ProductName,
                i.Quantity,
                i.Price,
                i.Currency)).ToList(),
            cart.GetTotal(),
            cart.Items.FirstOrDefault()?.Currency ?? "EUR", // Default to EUR if no items
            DateTime.UtcNow
        );

        try
        {
            // Send request and wait for response from Orders service
            var response = await _requestClient.GetResponse<OrderCreatedResponse>(
                checkoutEvent,
                cancellationToken,
                timeout: TimeSpan.FromSeconds(30));

            if (response.Message.Success)
            {
                // Clear cart after successful order creation
                cart.Clear();
                await _cartRepository.SaveAsync(cart);

                return new CheckoutResultResponse
                (
                    Success: true,
                    Message: "Checkout successful",
                    OrderId: response.Message.OrderId
                );
            }
            else
            {
                return new CheckoutResultResponse
                (
                    Success: false,
                    Message: response.Message.Message ?? "Order creation failed",
                    OrderId: null
                );
            }
        }
        catch (RequestTimeoutException)
        {
            return new CheckoutResultResponse
            (
                Success: false,
                Message: "Checkout timeout. Please try again.",
                OrderId: null
            );
        }
        catch (Exception ex)
        {
            return new CheckoutResultResponse
            (
                Success: false,
                Message: $"Checkout failed: {ex.Message}",
                OrderId: null
            );
        }
    }
}
