using MediatR;
using Orders.Application.DTOs.Responses;

namespace Orders.Application.Queries;

public class GetOrderByIdQuery : IRequest<OrderResponseDto>
{
    public Guid OrderId { get; set; }
}