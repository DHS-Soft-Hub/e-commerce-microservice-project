using MediatR;
using Orders.Application.DTOs;
using Shared.Domain.Common;

namespace Orders.Application.Queries
{
    public class GetOrdersQuery : PaginationQuery, IRequest<PaginatedResult<OrderDto>>
    {
        
    }
}
