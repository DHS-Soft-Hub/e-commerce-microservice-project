using MediatR;
using Orders.Application.Commands;
using Orders.Application.DTOs;
using Orders.Domain.Repositories;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Orders.Domain.ValueObjects;
using Shared.Domain.Common;


namespace Orders.Application.Commands;

public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, OrderDto>
{
    private readonly IOrderRepository _orderRepository;

    public UpdateOrderCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDto> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        Order order = await _orderRepository.GetByIdAsync(request.OrderId);

        // Update order properties
        var result = order.Update(
            request.OrderId,
            request.CustomerId,
            request.Items.Select(item => new OrderItem(
                item.Id,
                request.OrderId,
                item.ProductId,
                item.ProductName,
                item.Quantity,
                item.UnitPrice,
                item.Currency
            )).ToList(),
            request.Currency,
            request.Status
        );

        if (result.IsFailure)
        {
            throw new Exception("Failed to update order.");
        }

        await _orderRepository.UpdateAsync(result.Value);

        return new OrderDto
        {
            Id = order.Id.Value,
            CustomerId = order.CustomerId.Value,
            Items = order.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList(),
            TotalPrice = order.TotalPrice,
            Currency = order.Currency,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedDate
        };
    }
}