namespace Orders.Application.DTOs;

public record OrderItemDto(
    Guid? Id,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    string Currency = "EUR"
);