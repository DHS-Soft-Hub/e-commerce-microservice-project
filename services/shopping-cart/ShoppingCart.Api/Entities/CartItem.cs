using Shared.Domain.Entities;
using System.Text.Json.Serialization;

namespace ShoppingCart.Api.Entities;

public class CartItem : BaseEntity<Guid>
{
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public string Currency { get; private set; } = string.Empty;
    public int Quantity { get; private set; }
    public DateTime AddedAt { get; private set; }

    [JsonConstructor]
    private CartItem() { } // EF Core

    private CartItem(Guid productId, string productName, decimal price, string currency, int quantity)
    {
        Id = Guid.NewGuid();
        ProductId = productId;
        ProductName = productName;
        Price = price;
        Currency = currency;
        Quantity = quantity;
        AddedAt = DateTime.UtcNow;
    }

    public static CartItem Create(Guid productId, string productName, decimal price, string currency, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than 0");

        return new CartItem(productId, productName, price, currency, quantity);
    }

    public void UpdateQuantity(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than 0");

        Quantity = quantity;
    }
}
