using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Contracts.Responses;

public class CheckoutDataResponse
{
    public List<CartItem> Items { get; set; } = new List<CartItem>();
    public decimal Total { get; set; }
}
