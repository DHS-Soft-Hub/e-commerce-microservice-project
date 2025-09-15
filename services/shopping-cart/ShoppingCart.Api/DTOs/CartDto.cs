namespace ShoppingCart.Api.DTOs
{
    public record CartDto(
        Guid Id,
        List<CartItemDto> Items,
        decimal TotalPrice,
        string Currency);
}
