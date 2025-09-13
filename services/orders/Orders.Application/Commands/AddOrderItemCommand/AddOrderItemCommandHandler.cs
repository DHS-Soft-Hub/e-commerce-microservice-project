using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Entities;
using Orders.Domain.Enums;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;
using Shared.Domain.ValueObjects;

namespace Orders.Application.Commands;

public class AddOrderItemCommandHandler : IRequestHandler<AddOrderItemCommand, OrderDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddOrderItemCommandHandler(
        IOrderRepository orderRepository,
        IUnitOfWork unitOfWork
    )
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<OrderDto> Handle(AddOrderItemCommand request, CancellationToken cancellationToken)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
            if (order == null)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new Exception($"Order with ID {request.OrderId} not found.");
            }
    
            var orderItemResult = OrderItem.Create(
                order.Id,
                new ProductId(request.Item.ProductId),
                request.Item.ProductName,
                request.Item.Quantity,
                new Money(request.Item.UnitPrice, request.Item.Currency)
            );

            if (orderItemResult.IsFailure)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new Exception(orderItemResult.Errors.First());
            }

            order.AddItem(orderItemResult.Value);

            await _orderRepository.UpdateAsync(order, cancellationToken);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new OrderDto
            (
                order.Id,
                order.CustomerId,
                order.Items.Select(i => new OrderItemDto
                (
                    i.Id,
                    i.ProductId,
                    i.ProductName,
                    i.Quantity,
                    i.UnitPrice.Amount,
                    i.UnitPrice.Currency
                )).ToList(),
                order.TotalPrice.Currency,
                Enum.GetName<OrderStatus>(order.Status)!,
                order.CreatedDate,
                order.UpdatedDate
            );
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}