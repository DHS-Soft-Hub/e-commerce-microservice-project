namespace Orders.Application.DTOs;

public record OrderDto(
    Guid Id,
    Guid CustomerId,
    List<OrderItemDto> Items,
    string Currency,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);