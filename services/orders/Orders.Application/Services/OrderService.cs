using MediatR;
using Orders.Application.Commands;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;
using Orders.Application.Queries;

namespace Orders.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMediator _mediator;

        public OrderService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<CreateOrderResponseDto> CreateOrderAsync(
            CreateOrderRequestDto order,
            CancellationToken cancellationToken = default)
        {
            var orderCommand = new CreateOrderCommand(
                order.CustomerId,
                order.Items,
                order.Currency
            );
            return await _mediator.Send(orderCommand, cancellationToken);
        }

        public async Task<OrderDto> GetOrderAsync(
            Guid orderId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetOrderByIdQuery { OrderId = orderId };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<List<OrderDto>> GetOrdersAsync(
            CancellationToken cancellationToken = default)
        {
            var query = new GetOrdersQuery();
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<List<OrderDto>> GetOrdersByCustomerIdAsync(
            Guid customerId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetOrdersByCustomerIdQuery { CustomerId = customerId };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<OrderDto> AddItemToOrderAsync(
            Guid orderId,
            CreateOrderItemRequestDto item,
            CancellationToken cancellationToken = default)
        {
            var command = new AddOrderItemCommand(orderId, item);
            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<OrderDto> RemoveItemFromOrderAsync(
            Guid orderId,
            Guid itemId,
            CancellationToken cancellationToken = default)
        {
            var command = new RemoveOrderItemCommand(orderId, itemId);
            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<OrderDto> UpdateOrderItemQuantityAsync(
            Guid orderId,
            Guid itemId,
            int quantity,
            CancellationToken cancellationToken = default)
        {
            var command = new UpdateOrderItemQuantityCommand(orderId, itemId, quantity);
            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Unit> UpdateOrderStatusAsync(
            Guid orderId,
            string status,
            CancellationToken cancellationToken = default)
        {
            var command = new UpdateOrderStatusCommand(orderId, status);
            return await _mediator.Send(command, cancellationToken);
        }
    }
}