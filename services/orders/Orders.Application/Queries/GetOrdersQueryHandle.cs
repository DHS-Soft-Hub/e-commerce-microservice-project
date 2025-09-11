using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Repositories;

namespace Orders.Application.Queries
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, List<OrderDto>>
    {
        private readonly IOrderRepository _orderRepository;

        public GetOrdersQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(o => new OrderDto
            {
                Id = o.Id.Value,
                CustomerId = o.CustomerId.Value,
                Items = o.Items.Select(p => new OrderItemDto
                {
                    Id = p.Id.Value,
                    ProductId = p.ProductId.Value,
                    ProductName = p.ProductName,
                    UnitPrice = p.UnitPrice,
                    Quantity = p.Quantity,
                }).ToList(),
                TotalPrice = o.TotalPrice,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedDate
            }).ToList();
        }
    }
}
