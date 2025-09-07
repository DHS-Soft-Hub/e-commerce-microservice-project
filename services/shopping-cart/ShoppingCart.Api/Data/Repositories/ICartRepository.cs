using ShoppingCart.Api.Models.Entities;

namespace ShoppingCart.Api.Data.Repositories
{
    public interface ICartRepository
    {
        Task<Cart?> GetByUserOrSessionAsync(Guid? userId, string? sessionId);
        Task SaveAsync(Cart cart);
        Task DeleteAsync(Cart cart);
        Task<Cart?> GetBySessionAsync(string sessionId);
        Task<Cart?> GetByUserAsync(Guid userId);
    }
}