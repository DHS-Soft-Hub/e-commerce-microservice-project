using MediatR;
using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Commands.UpdateItemQuantityCommand;

public class UpdateItemQuantityCommandHandler : IRequestHandler<UpdateItemQuantityCommand, Cart>
{
    private readonly ICartRepository _cartRepository;

    public UpdateItemQuantityCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Cart> Handle(UpdateItemQuantityCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserOrSessionAsync(request.UserId, request.SessionId);
        if (cart == null) throw new Exception("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        if (item == null) throw new Exception("Item not found");

        item.UpdateQuantity(request.Quantity);
        await _cartRepository.SaveAsync(cart);
        return cart;
    }
}