namespace Web.DTOs
{
    public record OrderDto(
        Guid Id,
        Guid CustomerId,
        List<OrderItemDto> Items,
        decimal TotalPrice,
        string Currency,
        string Status,
        DateTime CreatedAt);
}
