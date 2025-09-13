using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Repositories;
using Shared.Domain.Common;

namespace Orders.Application.Queries
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, PaginatedResult<OrderDto>>
    {
        private readonly IOrderRepository _orderRepository;

        public GetOrdersQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<PaginatedResult<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var totalCount = await _orderRepository.GetCountAsync(cancellationToken);
            var orders = await _orderRepository.GetAllAsync();

            return new PaginatedResult<OrderDto>
            {
                Items = orders.Select(o => new OrderDto
                (
                    o.Id.Value,
                    o.CustomerId.Value,
                    o.Items.Select(item => new OrderItemDto(
                        item.Id?.Value,
                        item.ProductId.Value,
                        item.ProductName,
                        item.Quantity,
                        item.UnitPrice.Amount,
                        item.UnitPrice.Currency
                    )).ToList(),
                    o.TotalPrice.Currency,
                    o.Status.ToString(),
                    o.CreatedDate,
                    o.UpdatedDate
                )).ToList(),
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}