namespace Web.Services.Cart.DTOs
{
    public class AddToCartInput
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public CartItemInput Item { get; set; } = new();
    }

    public class CartItemInput
    {
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
    }

    public class RemoveFromCartInput
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public string ItemId { get; set; } = string.Empty;
    }

    public class UpdateItemQuantityInput
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public string ItemId { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    public class CheckoutInput
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
    }

    public class CheckoutResultDto
    {
        public string OrderId { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
