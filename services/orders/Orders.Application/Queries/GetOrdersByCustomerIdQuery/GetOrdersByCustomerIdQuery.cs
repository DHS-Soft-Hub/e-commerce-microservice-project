using MediatR;
using Orders.Application.DTOs;
using Shared.Domain.Common;

namespace Orders.Application.Queries;

public class GetOrdersByCustomerIdQuery : PaginationQuery, IRequest<PaginatedResult<OrderDto>>
{
    public Guid CustomerId { get; set; }
}