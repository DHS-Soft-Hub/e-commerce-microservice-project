using Orders.Api.Grpc;
using ApiGateway.Queries.Orders;
using Grpc.Net.Client;

namespace ApiGateway.Services;

public interface IOrdersGrpcService
{
    Task<OrderType> CreateOrderAsync(CreateOrderInput input);
    Task<OrderType> GetOrderByIdAsync(string orderId);
    Task<PaginatedOrdersType> GetOrdersAsync(int pageNumber = 1, int pageSize = 10);
    Task<OrderType> AddItemToOrderAsync(AddItemToOrderInput input);
    Task<OrderType> RemoveItemFromOrderAsync(RemoveItemFromOrderInput input);
    Task<OrderType> UpdateOrderItemQuantityAsync(UpdateOrderItemQuantityInput input);
    Task<bool> UpdateOrderStatusAsync(UpdateOrderStatusInput input);
    Task<PaginatedOrdersType> GetOrdersByCustomerIdAsync(string customerId, int pageNumber = 1, int pageSize = 10);
}

public class OrdersGrpcService : IOrdersGrpcService
{
    private readonly Orders.Api.Grpc.Orders.OrdersClient _client;
    private readonly ILogger<OrdersGrpcService> _logger;

    public OrdersGrpcService(IConfiguration configuration, ILogger<OrdersGrpcService> logger)
    {
        _logger = logger;
        var orderServiceUrl = configuration["GrpcServices:Orders"] ?? "https://localhost:7001";
        var channel = GrpcChannel.ForAddress(orderServiceUrl);
        _client = new Orders.Api.Grpc.Orders.OrdersClient(channel);
    }

    public async Task<OrderType> CreateOrderAsync(CreateOrderInput input)
    {
        try
        {
            var request = new CreateOrderRequest
            {
                CustomerId = input.CustomerId,
                Currency = input.Currency
            };

            request.Items.AddRange(input.Items.Select(item => new CreateOrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                UnitPrice = (double)item.UnitPrice,
                Currency = item.Currency
            }));

            var response = await _client.CreateOrderAsync(request);
            return MapToOrderType(response.Order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            throw;
        }
    }

    public async Task<OrderType> GetOrderByIdAsync(string orderId)
    {
        try
        {
            var request = new GetOrderRequest { OrderId = orderId };
            var response = await _client.GetOrderByIdAsync(request);
            return MapToOrderType(response.Order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order by id: {OrderId}", orderId);
            throw;
        }
    }

    public async Task<PaginatedOrdersType> GetOrdersAsync(int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var request = new GetOrdersRequest
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var response = await _client.GetOrdersAsync(request);
            return new PaginatedOrdersType
            {
                Orders = response.Orders.Select(MapToOrderType).ToList(),
                TotalCount = response.TotalCount,
                PageNumber = response.PageNumber,
                PageSize = response.PageSize,
                TotalPages = response.TotalPages
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            throw;
        }
    }

    public async Task<OrderType> AddItemToOrderAsync(AddItemToOrderInput input)
    {
        try
        {
            var request = new AddItemToOrderRequest
            {
                OrderId = input.OrderId,
                Item = new CreateOrderItem
                {
                    ProductId = input.Item.ProductId,
                    ProductName = input.Item.ProductName,
                    Quantity = input.Item.Quantity,
                    UnitPrice = (double)input.Item.UnitPrice,
                    Currency = input.Item.Currency
                }
            };

            var response = await _client.AddItemToOrderAsync(request);
            return MapToOrderType(response.Order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding item to order");
            throw;
        }
    }

    public async Task<OrderType> RemoveItemFromOrderAsync(RemoveItemFromOrderInput input)
    {
        try
        {
            var request = new RemoveItemFromOrderRequest
            {
                OrderId = input.OrderId,
                ItemId = input.ItemId
            };

            var response = await _client.RemoveItemFromOrderAsync(request);
            return MapToOrderType(response.Order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing item from order");
            throw;
        }
    }

    public async Task<OrderType> UpdateOrderItemQuantityAsync(UpdateOrderItemQuantityInput input)
    {
        try
        {
            var request = new UpdateOrderItemQuantityRequest
            {
                OrderId = input.OrderId,
                ItemId = input.ItemId,
                Quantity = input.Quantity
            };

            var response = await _client.UpdateOrderItemQuantityAsync(request);
            return MapToOrderType(response.Order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order item quantity");
            throw;
        }
    }

    public async Task<bool> UpdateOrderStatusAsync(UpdateOrderStatusInput input)
    {
        try
        {
            var request = new UpdateOrderStatusRequest
            {
                OrderId = input.OrderId,
                Status = input.Status
            };

            var response = await _client.UpdateOrderStatusAsync(request);
            return response.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status");
            throw;
        }
    }

    public async Task<PaginatedOrdersType> GetOrdersByCustomerIdAsync(string customerId, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var request = new GetOrdersByCustomerIdRequest
            {
                CustomerId = customerId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var response = await _client.GetOrdersByCustomerIdAsync(request);
            return new PaginatedOrdersType
            {
                Orders = response.Orders.Select(MapToOrderType).ToList(),
                TotalCount = response.TotalCount,
                PageNumber = response.PageNumber,
                PageSize = response.PageSize,
                TotalPages = response.TotalPages
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders by customer id: {CustomerId}", customerId);
            throw;
        }
    }

    private static OrderType MapToOrderType(Order order)
    {
        return new OrderType
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Currency = order.Currency,
            Status = order.Status,
            CreatedAt = new DateTime(order.CreatedAt),
            UpdatedAt = new DateTime(order.UpdatedAt),
            TotalAmount = (decimal)order.TotalAmount,
            Items = order.Items.Select(item => new OrderItemType
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                UnitPrice = (decimal)item.UnitPrice,
                Currency = item.Currency
            }).ToList()
        };
    }
}
