

namespace Orders.Application.Queries;

using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Responses;
using Orders.Domain.Repositories;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderResponseDto>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderResponseDto> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {request.OrderId} not found.");
        }

        return new OrderResponseDto
        (
            order.Id.Value,
            order.CustomerId.Value,
            order.Items.Select(item => new OrderItemDto(
                item.ProductId.Value,
                item.ProductName,
                item.Quantity,
                item.UnitPrice.Amount,
                item.UnitPrice.Currency
            )).ToList(),
            order.TotalPrice.Currency,
            order.Status.ToString(),
            order.CreatedDate,
            order.UpdatedDate
        );
    }
}