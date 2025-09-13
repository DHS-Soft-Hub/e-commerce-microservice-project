namespace Orders.Application.DTOs.Responses;

public record OrderResponseDto(
    Guid Id,
    Guid CustomerId,
    List<OrderItemDto> Items,
    string Currency,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);