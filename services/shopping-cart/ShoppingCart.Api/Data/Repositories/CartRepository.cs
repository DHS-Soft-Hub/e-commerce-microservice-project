using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using ShoppingCart.Api.Data.Contexts;
using ShoppingCart.Api.Models.Entities;
using System.Text.Json;

namespace ShoppingCart.Api.Data.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ShoppingCartDbContext _context;
    private readonly IDistributedCache _cache;
    private const int CACHE_EXPIRY_HOURS = 24;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };


    public CartRepository(ShoppingCartDbContext context, IDistributedCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Cart?> GetByUserOrSessionAsync(Guid? userId, string? sessionId)
    {
        var cacheKey = GetCacheKey(userId, sessionId);
        var cachedCart = await _cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedCart))
        {
            var cart = JsonSerializer.Deserialize<Cart>(cachedCart, JsonOptions);
            if (cart != null)
            {
                _context.Attach(cart);
                if (cart.Items != null)
                {
                    foreach (var item in cart.Items)
                    {
                        _context.Attach(item);
                    }
                }
            }
            return cart;
        }

        Cart? dbCart = null;
        
        if (userId.HasValue)
        {
            dbCart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            dbCart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        }

        if (dbCart != null)
        {
            await CacheCartAsync(dbCart);
        }

        return dbCart;
    }

    public async Task SaveAsync(Cart cart)
    {
        // Detach any tracked entities to avoid conflicts
        _context.ChangeTracker.Clear();
        
        var existingCart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == cart.Id);
        
        if (existingCart == null)
        {
            _context.Carts.Add(cart);
        }
        else
        {
            _context.Entry(existingCart).CurrentValues.SetValues(cart);
        }

        await _context.SaveChangesAsync();
        await CacheCartAsync(cart);
    }

    private async Task CacheCartAsync(Cart cart)
    {
        var cacheKey = GetCacheKey(cart.UserId, cart.SessionId);
        var serializedCart = JsonSerializer.Serialize(cart, JsonOptions);
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(CACHE_EXPIRY_HOURS)
        };
        
        await _cache.SetStringAsync(cacheKey, serializedCart, options);
    }

    private static string GetCacheKey(Guid? userId, string? sessionId)
    {
        return userId.HasValue ? $"cart:user:{userId}" : $"cart:session:{sessionId}";
    }

    public Task DeleteAsync(Cart cart)
    {
        return Task.CompletedTask;
    }

    public Task<Cart?> GetBySessionAsync(string sessionId)
    {
        return Task.FromResult<Cart?>(null);
    }

    public Task<Cart?> GetByUserAsync(Guid userId)
    {
        return Task.FromResult<Cart?>(null);
    }
}