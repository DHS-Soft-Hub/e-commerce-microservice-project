using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Responses;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;
using Shared.Domain.ValueObjects;

namespace Orders.Application.Commands
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResponseDto>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateOrderCommandHandler(
            IOrderRepository orderRepository,
            IUnitOfWork unitOfWork
        )
        {
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CreateOrderResponseDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);
                    
                var order = Order.Create(
                    new CustomerId(request.CustomerId),
                    request.Currency
                );

                if (order.IsFailure)
                {
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    throw new Exception(order.Errors.First());
                }

                if (order.Value == null || !order.Value.Items.Any())
                {
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    throw new Exception("Order must contain at least one item.");
                }

                var orderId = order.Value.Id;
                if (request.Items != null)
                {
                    foreach (var item in request.Items)
                    {
                        var orderItem = OrderItem.Create(
                            orderId,
                            new ProductId(item.ProductId),
                            item.ProductName,
                            item.Quantity,
                            new Money(item.UnitPrice, item.Currency)
                        );

                        if (orderItem.IsFailure)
                        {
                            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                            throw new Exception(orderItem.Errors.First());
                        }

                        order.Value.AddItem(orderItem.Value);
                    }
                }

                await _orderRepository.AddAsync(order.Value);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                // Return OrderDto matching Frontend expectations
                return new CreateOrderResponseDto(
                    orderId.Value,
                    order.Value.Status.ToString()
                );
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
    }
}