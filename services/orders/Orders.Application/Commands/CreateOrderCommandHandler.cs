using MediatR;
using Orders.Application.DTOs;
using Orders.Domain.Aggregates;
using Orders.Domain.Entities;
using Orders.Domain.Repositories;
using Orders.Domain.ValueObjects;
using Shared.Domain.Interfaces;

namespace Orders.Application.Commands
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
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

        public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync(cancellationToken);

                // Create order with saga-provided OrderId if available
                var orderId = request.OrderId.HasValue 
                    ? new OrderId(request.OrderId.Value) 
                    : new OrderId(Guid.NewGuid());
                    
                var order = Order.Create(
                    orderId,
                    new CustomerId(request.CustomerId),
                    request.Items.Select(item => new OrderItem(
                        new OrderItemId(Guid.NewGuid()),
                        orderId,
                        new ProductId(item.ProductId),
                        item.ProductName,
                        item.Quantity,
                        item.Price,
                        item.Currency
                    )).ToList(),
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

                await _orderRepository.AddAsync(order.Value);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                // Return OrderDto matching Frontend expectations
                return new OrderDto
                {
                    Id = order.Value.Id.Value,
                    CustomerId = order.Value.CustomerId.Value,
                    Items = order.Value.Items.Select(item => new OrderItemDto
                    {
                        Id = item.Id.Value,
                        ProductId = item.ProductId.Value,
                        ProductName = request.Items.First(i => i.ProductId == item.ProductId.Value).ProductName,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        Currency = item.Currency
                    }).ToList(),
                    TotalPrice = order.Value.TotalPrice,
                    Currency = order.Value.Currency,
                    Status = order.Value.Status.ToString(),
                    CreatedAt = order.Value.CreatedDate
                };
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
    }
}