using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Commands.AddItemToCartCommand;

public class AddItemToCartCommandHandler : IRequestHandler<AddItemToCartCommand, Unit>
{
    private readonly ICartRepository _cartRepository;

    public AddItemToCartCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Unit> Handle(AddItemToCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserOrSessionAsync(request.UserId, request.SessionId);

        if (cart == null)
        {
            if (request.UserId == null && request.SessionId == null)
                throw new ArgumentException("Either UserId or SessionId must be provided to create a cart.");

            if (request.UserId == null)
                cart = Cart.CreateAnonymousCart(request.SessionId!);
            else
                cart = Cart.CreateUserCart(request.UserId.Value);
        }

        cart.AddItem(request.ProductId, request.ProductName, request.Price, request.Currency, request.Quantity);

        await _cartRepository.SaveAsync(cart);
        
        return Unit.Value;
    }
}