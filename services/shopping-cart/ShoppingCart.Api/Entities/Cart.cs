using Shared.Domain.Aggregates;
using ShoppingCart.Api.Events;

namespace ShoppingCart.Api.Entities;

public class Cart : AggregateRoot<Guid>
{
    public Guid? UserId { get; private set; } // Null for anonymous sessions
    public string? SessionId { get; private set; } // For anonymous users
    private List<CartItem> _items = new();
    public List<CartItem> Items { get { return _items; } set { _items = value; } }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Helper method to check if cart is empty
    public bool IsEmpty() => !_items.Any();

    // Calculate total price of the cart
    public decimal GetTotal() => _items.Sum(x => x.Price * x.Quantity);

    private Cart() { } // EF Core

    protected Cart(Guid? userId, string? sessionId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        SessionId = sessionId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static Cart CreateAnonymousCart(string sessionId)
    {
        return new Cart(null, sessionId);
    }

    public static Cart CreateUserCart(Guid userId)
    {
        return new Cart(userId, null);
    }

    public void AddItem(Guid productId, string productName, decimal price, string currency, int quantity)
    {
        var existingItem = _items.FirstOrDefault(x => x.ProductId == productId);

        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            _items.Add(CartItem.Create(productId, productName, price, currency, quantity));
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveItem(Guid productId)
    {
        var item = _items.FirstOrDefault(x => x.ProductId == productId);
        if (item != null)
        {
            _items.Remove(item);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void UpdateItemQuantity(Guid productId, int quantity)
    {
        var item = _items.FirstOrDefault(x => x.ProductId == productId);
        if (item != null)
        {
            item.UpdateQuantity(quantity);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void MergeWith(Cart otherCart)
    {
        foreach (var item in otherCart.Items)
        {
            AddItem(item.ProductId, item.ProductName, item.Price, item.Currency, item.Quantity);
        }
    }

    public Cart CheckoutCart()
    {
        // Create a copy of the cart for checkout
        var checkoutCart = new Cart(UserId, SessionId)
        {
            Items = new List<CartItem>(_items),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Raise checkout event or perform additional logic if needed
        var checkoutEvent = new CartCheckedOutDomainEvent(checkoutCart.Id, UserId, SessionId);
        this.AddDomainEvent(checkoutEvent);

        return checkoutCart;
    }

    public void Clear()
    {
        _items.Clear();
        UpdatedAt = DateTime.UtcNow;
    }

}