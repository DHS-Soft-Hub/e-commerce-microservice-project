using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Queries;

public class GetOrderByIdQuery : IRequest<OrderDto>
{
    public Guid OrderId { get; set; }
}