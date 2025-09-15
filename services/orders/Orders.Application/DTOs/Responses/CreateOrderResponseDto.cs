namespace Orders.Application.DTOs.Responses;

public record CreateOrderResponseDto(
    Guid Id,
    string Status
);