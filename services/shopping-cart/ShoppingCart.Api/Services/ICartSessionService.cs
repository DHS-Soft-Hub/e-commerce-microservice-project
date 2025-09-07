namespace ShoppingCart.Api.Services;

public interface ICartSessionService
{
    Task<string> GetOrCreateSessionId(HttpContext context);
    Task MergeAnonymousCartWithUserCart(string sessionId, Guid userId);
}
