namespace Orders.Application.DTOs.Requests
{
    public record CreateOrderRequestDto
    (
        Guid CustomerId,
        List<OrderItemDto> Items,
        string Currency
    );
}