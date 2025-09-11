using ShoppingCart.Api.Data.Repositories;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Services;

public class CartSessionService : ICartSessionService
{
    private readonly ICartRepository _cartRepository;
    private const string SESSION_KEY = "CartSessionId";

    public CartSessionService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<string> GetOrCreateSessionId(HttpContext context)
    {
        var sessionId = context.Session.GetString(SESSION_KEY);
        
        if (string.IsNullOrEmpty(sessionId))
        {
            sessionId = Guid.NewGuid().ToString();
            context.Session.SetString(SESSION_KEY, sessionId);
        }

        return sessionId;
    }

    public async Task MergeAnonymousCartWithUserCart(string sessionId, Guid userId)
    {
        var anonymousCart = await _cartRepository.GetBySessionAsync(sessionId);
        var userCart = await _cartRepository.GetByUserAsync(userId);

        if (anonymousCart != null)
        {
            if (userCart == null)
            {
                // Transfer anonymous cart to user
                userCart = Cart.CreateUserCart(userId);
                userCart.MergeWith(anonymousCart);
            }
            else
            {
                // Merge anonymous cart with existing user cart
                userCart.MergeWith(anonymousCart);
            }

            await _cartRepository.SaveAsync(userCart);
            await _cartRepository.DeleteAsync(anonymousCart);
        }
    }
}