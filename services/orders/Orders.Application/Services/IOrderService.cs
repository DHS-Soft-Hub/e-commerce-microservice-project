using MediatR;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;

namespace Orders.Application.Services
{
    public interface IOrderService
    {
        Task<CreateOrderResponseDto> CreateOrderAsync(
            CreateOrderRequestDto order,
            CancellationToken cancellationToken = default);

        Task<OrderDto> GetOrderAsync(
            Guid orderId,
            CancellationToken cancellationToken = default);

        Task<List<OrderDto>> GetOrdersAsync(
            CancellationToken cancellationToken = default);

        Task<List<OrderDto>> GetOrdersByCustomerIdAsync(
            Guid customerId,
            CancellationToken cancellationToken = default);

        Task<OrderDto> AddItemToOrderAsync(
            Guid orderId,
            CreateOrderItemRequestDto item,
            CancellationToken cancellationToken = default);

        Task<OrderDto> RemoveItemFromOrderAsync(
            Guid orderId,
            Guid itemId,
            CancellationToken cancellationToken = default);

        Task<OrderDto> UpdateOrderItemQuantityAsync(
            Guid orderId,
            Guid itemId,
            int newQuantity,
            CancellationToken cancellationToken = default);

        Task<Unit> UpdateOrderStatusAsync(
            Guid orderId,
            string status,
            CancellationToken cancellationToken = default);
    }
}