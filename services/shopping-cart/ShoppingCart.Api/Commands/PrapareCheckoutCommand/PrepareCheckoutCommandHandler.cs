using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Commands.PrepareCheckoutCommand;

public class PrepareCheckoutCommandHandler : IRequestHandler<PrepareCheckoutCommand, CheckoutData>
{
    private readonly ICartRepository _cartRepository;

    public PrepareCheckoutCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CheckoutData> Handle(PrepareCheckoutCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserAsync(request.UserId);
        if (cart == null)
        {
            throw new InvalidOperationException($"Cart not found for user {request.UserId}");
        }

        if (!cart.Items.Any())
        {
            throw new InvalidOperationException("Cannot checkout with empty cart");
        }

        // Prepare checkout data
        var checkoutData = new CheckoutData
        {
            Items = cart.Items.ToList(),
            Total = cart.GetTotal()
        };

        return checkoutData;
    }
}
