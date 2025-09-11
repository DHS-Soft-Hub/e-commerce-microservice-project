namespace Web.DTOs
{
    public record OrderItemDto(
        Guid Id,
        Guid ProductId,
        string ProductName,
        decimal UnitPrice,
        string Currency,
        int Quantity);
}
