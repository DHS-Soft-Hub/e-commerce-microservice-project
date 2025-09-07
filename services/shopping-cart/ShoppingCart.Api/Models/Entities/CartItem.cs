namespace ShoppingCart.Api.Models.Entities;

public class CartItem
{
    public Guid Id { get; private set; }
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; }
    public decimal Price { get; private set; }
    public int Quantity { get; private set; }
    public DateTime AddedAt { get; private set; }

    private CartItem() { } // EF Core

    public CartItem(Guid productId, string productName, decimal price, int quantity)
    {
        Id = Guid.NewGuid();
        ProductId = productId;
        ProductName = productName;
        Price = price;
        Quantity = quantity;
        AddedAt = DateTime.UtcNow;
    }

    public void UpdateQuantity(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be greater than 0");
        
        Quantity = quantity;
    }
}
