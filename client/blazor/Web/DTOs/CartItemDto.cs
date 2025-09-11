namespace Web.DTOs
{
    public record CartItemDto(
        Guid ProductId,
        string ProductName,
        decimal Price,
        string Currency,
        int Quantity);
}
