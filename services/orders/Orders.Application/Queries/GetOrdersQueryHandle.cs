using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Responses;
using Orders.Domain.Repositories;

namespace Orders.Application.Queries
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, List<OrderResponseDto>>
    {
        private readonly IOrderRepository _orderRepository;

        public GetOrdersQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<List<OrderResponseDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(o => new OrderResponseDto
            (
                o.Id.Value,
                o.CustomerId.Value,
                o.Items.Select(item => new OrderItemDto(
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
            )).ToList();
        }
    }
}