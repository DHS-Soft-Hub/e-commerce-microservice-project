using Shared.Domain.Events;

namespace ShoppingCart.Api.Events;

public class CartCheckedOutDomainEvent : IDomainEvent
{
    public Guid CartId { get; }
    public Guid? UserId { get; }
    public string? SessionId { get; }
    public List<CheckedOutCartItem> CartItems { get; }
    public decimal TotalAmount { get; }
    public string Currency { get; }
    public DateTime CheckedOutAt { get; }

    public CartCheckedOutDomainEvent(
        Guid cartId,
        Guid? userId,
        string? sessionId,
        List<CheckedOutCartItem> cartItems,
        decimal totalAmount,
        string currency)
    {
        CartId = cartId;
        UserId = userId;
        SessionId = sessionId;
        CartItems = cartItems;
        TotalAmount = totalAmount;
        Currency = currency;
        CheckedOutAt = DateTime.UtcNow;
    }
}

public class CheckedOutCartItem
{
    public Guid Id { get; init; }
    public Guid ProductId { get; init; }
    public string ProductName { get; init; }
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal TotalPrice { get; init; }
    public string Currency { get; init; }

    public CheckedOutCartItem(Guid id, Guid productId, string productName, int quantity, decimal unitPrice, string currency)
    {
        Id = id;
        ProductId = productId;
        ProductName = productName;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Currency = currency;
        TotalPrice = quantity * unitPrice;
    }
}