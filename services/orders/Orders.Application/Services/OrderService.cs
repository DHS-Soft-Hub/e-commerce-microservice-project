using MediatR;
using Orders.Application.Commands;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;
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

        public async Task<OrderResponseDto> GetOrderAsync(
            Guid orderId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetOrderByIdQuery { OrderId = orderId };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<List<OrderResponseDto>> GetOrdersAsync(
            CancellationToken cancellationToken = default)
        {
            var query = new GetOrdersQuery();
            return await _mediator.Send(query, cancellationToken);
        }
    }
}