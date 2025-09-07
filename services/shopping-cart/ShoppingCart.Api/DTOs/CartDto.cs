namespace ShoppingCart.Api.DTOs
{
    public record CartDto(
        List<CartItemDto> Items,
        decimal TotalPrice,
        string Currency);
}
