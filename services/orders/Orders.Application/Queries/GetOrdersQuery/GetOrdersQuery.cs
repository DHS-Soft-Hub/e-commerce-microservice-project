using MediatR;
using Orders.Application.DTOs;

namespace Orders.Application.Queries
{
    public class GetOrdersQuery : IRequest<List<OrderDto>>
    {
        
    }
}
