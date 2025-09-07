namespace ShoppingCart.Api.Entities;

public class CheckoutData
{
    public List<CartItem> Items { get; set; } = new List<CartItem>();
    public decimal Total { get; set; }
}
