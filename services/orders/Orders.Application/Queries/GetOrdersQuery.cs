using MediatR;
using Orders.Application.DTOs.Responses;

namespace Orders.Application.Queries
{
    public class GetOrdersQuery : IRequest<List<OrderResponseDto>>
    {
        
    }
}
