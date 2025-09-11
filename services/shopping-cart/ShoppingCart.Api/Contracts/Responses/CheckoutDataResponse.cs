using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Contracts.Responses;

public class CheckoutDataResponse
{
    public List<CheckoutItemResponse> Items { get; set; } = new List<CheckoutItemResponse>();
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
}

public class CheckoutItemResponse
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public int Quantity { get; set; }
}