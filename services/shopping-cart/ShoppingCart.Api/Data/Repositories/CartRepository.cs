using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using ShoppingCart.Api.Data.Contexts;
using ShoppingCart.Api.Entities;
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
        // Temporarily disable caching to avoid JSON deserialization issues
        // TODO: Implement proper caching strategy for domain entities
        
        Cart? dbCart = null;
        
        if (userId.HasValue)
        {
            dbCart = await _context.Carts
                .Include(c => c.Items)
                .OrderByDescending(c => c.UpdatedAt)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            dbCart = await _context.Carts
                .Include(c => c.Items)
                .OrderByDescending(c => c.UpdatedAt)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);
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
            // Update cart properties
            _context.Entry(existingCart).CurrentValues.SetValues(cart);
            
            // Handle the items collection manually
            // Remove items that are no longer in the cart
            var currentItemIds = cart.Items.Select(i => i.Id).ToHashSet();
            var itemsToRemove = existingCart.Items.Where(i => !currentItemIds.Contains(i.Id)).ToList();
            foreach (var item in itemsToRemove)
            {
                existingCart.Items.Remove(item);
            }
            
            // Add new items and update existing ones
            foreach (var newItem in cart.Items)
            {
                var existingItem = existingCart.Items.FirstOrDefault(i => i.Id == newItem.Id);
                if (existingItem == null)
                {
                    // Add new item
                    existingCart.Items.Add(newItem);
                }
                else
                {
                    // Update existing item
                    _context.Entry(existingItem).CurrentValues.SetValues(newItem);
                }
            }
        }

        await _context.SaveChangesAsync();
        // Temporarily disable caching
        // await CacheCartAsync(cart);
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

    private static bool IsCartValid(Cart cart)
    {
        return cart.Id != Guid.Empty;
    }

    private static bool IsCartItemValid(CartItem item)
    {
        return item.Id != Guid.Empty && 
               !string.IsNullOrEmpty(item.ProductName) && 
               !string.IsNullOrEmpty(item.Currency) &&
               item.ProductId != Guid.Empty;
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