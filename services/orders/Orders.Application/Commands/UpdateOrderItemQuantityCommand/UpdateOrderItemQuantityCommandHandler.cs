using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Enums;
using Orders.Domain.Repositories;
using Shared.Domain.Interfaces;

namespace Orders.Application.Commands;

public class UpdateOrderItemQuantityCommandHandler : IRequestHandler<UpdateOrderItemQuantityCommand, OrderDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateOrderItemQuantityCommandHandler(
        IOrderRepository orderRepository,
        IUnitOfWork unitOfWork
    )
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<OrderDto> Handle(UpdateOrderItemQuantityCommand request, CancellationToken cancellationToken)
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

            var item = order.Items.FirstOrDefault(i => i.Id == request.ItemId);
            if (item == null)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw new Exception($"Order item with ID {request.ItemId} not found in order {request.OrderId}.");
            }

            order.RemoveItem(item);

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
        catch
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }
}