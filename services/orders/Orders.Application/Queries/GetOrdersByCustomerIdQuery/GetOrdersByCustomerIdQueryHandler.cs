using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Enums;
using Orders.Domain.Repositories;
using Shared.Domain.Common;

namespace Orders.Application.Queries;
public class GetOrdersByCustomerIdQueryHandler : IRequestHandler<GetOrdersByCustomerIdQuery, PaginatedResult<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrdersByCustomerIdQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<PaginatedResult<OrderDto>> Handle(GetOrdersByCustomerIdQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await _orderRepository.GetCountByCustomerIdAsync(request.CustomerId);
        var orders = await _orderRepository.GetByCustomerIdAsync(
            request.CustomerId,
            request.Skip,
            request.Take);

        var orderDtos = orders.Select(order => new OrderDto
        (
            order.Id,
            order.CustomerId,
            order.Items.Select(item => new OrderItemDto(
                item.Id,
                item.ProductId,
                item.ProductName,
                item.Quantity,
                item.UnitPrice.Amount,
                item.UnitPrice.Currency
            )).ToList(),
            order.TotalPrice.Currency,
            Enum.GetName<OrderStatus>(order.Status)!,
            order.CreatedDate,
            order.UpdatedDate
        )).ToList();

        return new PaginatedResult<OrderDto>
        {
            Items = orderDtos,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}