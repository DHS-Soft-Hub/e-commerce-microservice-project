using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Contracts.Responses;

namespace ShoppingCart.Api.Commands.PrepareCheckoutCommand;

public class PrepareCheckoutCommandHandler : IRequestHandler<PrepareCheckoutCommand, CheckoutDataResponse>
{
    private readonly ICartRepository _cartRepository;

    public PrepareCheckoutCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CheckoutDataResponse> Handle(PrepareCheckoutCommand request, CancellationToken cancellationToken)
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

        // Prepare checkout data
        var cartData = cart.CheckoutCart();
        var totalAmount = cartData.GetTotal();

        var checkoutData = new CheckoutDataResponse
        {
            Items = cart.Items.Select(i => new CheckoutItemResponse
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = i.Price,
                Currency = i.Currency,
                Quantity = i.Quantity
            }).ToList(),
            TotalAmount = totalAmount,
            Currency = cart.Items.First().Currency // Assuming all items have the same currency
        };

        // TODO: Here you could add more logic, like applying discounts, calculating taxes, etc.

        return checkoutData;
    }
}
