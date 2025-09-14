using Web.Services.Orders.DTOs;
using Web.Services.Orders.Queries;
using Web.Services.Orders.Mutations;
using Web.Services.Shared;

namespace Web.Services.Orders
{
    public class OrderService
    {
        private readonly GraphQLClient _graphQLClient;
        private readonly ILogger<OrderService> _logger;

        public OrderService(GraphQLClient graphQLClient, ILogger<OrderService> logger)
        {
            _graphQLClient = graphQLClient;
            _logger = logger;
        }

        public async Task<OrderDto?> GetOrderAsync(string orderId)
        {
            try
            {
                var variables = new { orderId };
                var response = await _graphQLClient.QueryAsync<OrderQueryResponse>(OrderQueries.GetOrder, variables);
                return response?.Order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {OrderId}", orderId);
                return null;
            }
        }

        public async Task<PaginatedOrdersDto?> GetOrdersAsync(int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var variables = new { pageNumber, pageSize };
                var response = await _graphQLClient.QueryAsync<OrdersQueryResponse>(OrderQueries.GetOrders, variables);
                return response?.Orders;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders");
                return null;
            }
        }

        public async Task<PaginatedOrdersDto?> GetOrdersByCustomerAsync(string customerId, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var variables = new { customerId, pageNumber, pageSize };
                var response = await _graphQLClient.QueryAsync<OrdersQueryResponse>(OrderQueries.GetOrdersByCustomer, variables);
                return response?.Orders;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders for customer {CustomerId}", customerId);
                return null;
            }
        }

        public async Task<OrderDto?> CreateOrderAsync(CreateOrderInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<OrderMutationResponse>(OrderMutations.CreateOrder, variables);
                return response?.Order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order for customer {CustomerId}", input.CustomerId);
                return null;
            }
        }

        public async Task<OrderDto?> AddItemToOrderAsync(AddItemToOrderInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<OrderMutationResponse>(OrderMutations.AddItemToOrder, variables);
                return response?.Order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to order {OrderId}", input.OrderId);
                return null;
            }
        }

        public async Task<OrderDto?> RemoveItemFromOrderAsync(RemoveItemFromOrderInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<OrderMutationResponse>(OrderMutations.RemoveItemFromOrder, variables);
                return response?.Order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from order {OrderId}", input.OrderId);
                return null;
            }
        }

        public async Task<OrderDto?> UpdateOrderItemQuantityAsync(UpdateOrderItemQuantityInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<OrderMutationResponse>(OrderMutations.UpdateOrderItemQuantity, variables);
                return response?.Order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating item quantity in order {OrderId}", input.OrderId);
                return null;
            }
        }

        public async Task<bool> UpdateOrderStatusAsync(UpdateOrderStatusInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<OrderStatusUpdateResponse>(OrderMutations.UpdateOrderStatus, variables);
                return response?.Success ?? false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", input.OrderId);
                return false;
            }
        }
    }

    // Response wrapper classes for GraphQL
    public class OrderQueryResponse
    {
        public OrderDto Order { get; set; } = new();
    }

    public class OrdersQueryResponse
    {
        public PaginatedOrdersDto Orders { get; set; } = new();
    }

    public class OrderMutationResponse
    {
        public OrderDto Order { get; set; } = new();
    }

    public class OrderStatusUpdateResponse
    {
        public bool Success { get; set; }
    }
}
