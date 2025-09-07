using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Models.Entities;

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
            cart = new Cart(request.UserId, request.SessionId);
        }

        cart.AddItem(request.ProductId, request.ProductName, request.Price, request.Quantity);
        
        await _cartRepository.SaveAsync(cart);
        
        return Unit.Value;
    }
}