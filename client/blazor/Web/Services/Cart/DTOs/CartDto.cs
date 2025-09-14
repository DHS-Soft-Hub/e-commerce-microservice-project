namespace Web.Services.Cart.DTOs
{
    public class CartDto
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalPrice { get; set; }
        public string Currency { get; set; } = string.Empty;
    }
}
