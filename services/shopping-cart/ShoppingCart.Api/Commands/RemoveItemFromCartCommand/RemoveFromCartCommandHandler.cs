using MediatR;
using ShoppingCart.Api.Data.Repositories;

namespace ShoppingCart.Api.Commands.RemoveItemFromCartCommand;

public class RemoveItemFromCartCommandHandler : IRequestHandler<RemoveItemFromCartCommand, Unit>
{
    private readonly ICartRepository _cartRepository;

    public RemoveItemFromCartCommandHandler(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<Unit> Handle(RemoveItemFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _cartRepository.GetByUserOrSessionAsync(request.UserId, request.SessionId);
        
        if (cart != null)
        {
            cart.RemoveItem(request.ProductId);
            await _cartRepository.SaveAsync(cart);
        }
        
        return Unit.Value;
    }
}