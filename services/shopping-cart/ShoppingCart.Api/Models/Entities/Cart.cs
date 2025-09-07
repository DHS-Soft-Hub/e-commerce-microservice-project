namespace ShoppingCart.Api.Models.Entities;

public class Cart
{
    public Guid Id { get; private set; }
    public Guid? UserId { get; private set; } // Null for anonymous sessions
    public string? SessionId { get; private set; } // For anonymous users
    private List<CartItem> _items = new();
    public List<CartItem> Items { get { return _items; } set { _items = value; } }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Cart() { } // EF Core

    public Cart(Guid? userId, string? sessionId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        SessionId = sessionId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddItem(Guid productId, string productName, decimal price, int quantity)
    {
        var existingItem = _items.FirstOrDefault(x => x.ProductId == productId);
        
        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            _items.Add(new CartItem(productId, productName, price, quantity));
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

    public void Clear()
    {
        _items.Clear();
        UpdatedAt = DateTime.UtcNow;
    }

    public decimal GetTotal() => _items.Sum(x => x.Price * x.Quantity);

    public void MergeWith(Cart otherCart)
    {
        foreach (var item in otherCart.Items)
        {
            AddItem(item.ProductId, item.ProductName, item.Price, item.Quantity);
        }
    }
}