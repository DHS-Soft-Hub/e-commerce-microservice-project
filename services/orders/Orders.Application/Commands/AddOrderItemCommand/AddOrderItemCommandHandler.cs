using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Entities;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;
using Shared.Domain.ValueObjects;

namespace Orders.Application.Commands;

public class AddOrderItemCommandHandler : IRequestHandler<AddOrderItemCommand, OrderItemDto>
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

    public async Task<OrderItemDto> Handle(AddOrderItemCommand request, CancellationToken cancellationToken)
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
                new ProductId(request.ProductId),
                request.ProductName,
                request.Quantity,
                new Money(request.UnitPrice, request.Currency)
            );

            if (orderItemResult.IsFailure)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new Exception(orderItemResult.Errors.First());
            }

            order.AddItem(orderItemResult.Value);

            await _orderRepository.UpdateAsync(order, cancellationToken);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new OrderItemDto
            (
                orderItemResult.Value.ProductId.Value,
                orderItemResult.Value.ProductName,
                orderItemResult.Value.Quantity,
                orderItemResult.Value.UnitPrice.Amount,
                orderItemResult.Value.UnitPrice.Currency
            );
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}