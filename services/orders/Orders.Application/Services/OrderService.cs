using MediatR;
using Orders.Application.Commands;
using Orders.Application.DTOs;
using Orders.Application.Queries;

namespace Orders.Application.Services
{
    public class OrderService
    {
        private readonly IMediator _mediator;

        public OrderService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<OrderDto> CreateOrderAsync(
            CreateOrderCommand order,
            CancellationToken cancellationToken = default)
        {
            return await _mediator.Send(order, cancellationToken);
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

        public async Task<OrderDto> UpdateOrderAsync(
            UpdateOrderCommand order,
            CancellationToken cancellationToken = default)
        {
            return await _mediator.Send(order, cancellationToken);
        }
    }
}