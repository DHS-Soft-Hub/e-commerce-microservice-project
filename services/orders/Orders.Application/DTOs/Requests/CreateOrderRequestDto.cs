namespace Orders.Application.DTOs.Requests
{
    public record CreateOrderRequestDto
    (
        Guid CustomerId,
        List<CreateOrderItemRequestDto> Items,
        string Currency
    );

    public record CreateOrderItemRequestDto
    (
        Guid ProductId,
        string ProductName,
        int Quantity,
        decimal UnitPrice,
        string Currency = "EUR"
    );
}