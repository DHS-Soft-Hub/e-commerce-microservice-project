using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.DTOs;

namespace ShoppingCart.Api.Queries;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto?>
{
    private readonly ICartRepository _cartRepository;

    public GetCartQueryHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CartDto?> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserOrSessionAsync(request.UserId, request.SessionId);
        
        if (cart == null)
        {
            return null;
        }

        var cartItems = cart.Items.Select(item => new CartItemDto(
            item.ProductId,
            item.ProductName,
            item.Price,
            "USD", // Default currency - this could be configurable
            item.Quantity
        )).ToList();

        return new CartDto(
            cart.Id,
            cartItems,
            cart.GetTotal(),
            "USD" // Default currency
        );
    }
}
