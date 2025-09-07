namespace ShoppingCart.Api.Contracts.Requests;

public class AddItemToCartRequest
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; }
    public int Quantity { get; set; }
}
