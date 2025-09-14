using ApiGateway.Queries.Orders;
using ApiGateway.Services;

namespace ApiGateway.Queries.Orders;

[ExtendObjectType(nameof(Query))]
public class OrdersQuery
{
    /// <summary>
    /// Get an order by its ID
    /// </summary>
    public async Task<OrderType> GetOrderAsync(
        [Service] IOrdersGrpcService ordersService,
        string orderId) =>
        await ordersService.GetOrderByIdAsync(orderId);

    /// <summary>
    /// Get paginated list of orders
    /// </summary>
    public async Task<PaginatedOrdersType> GetOrdersAsync(
        [Service] IOrdersGrpcService ordersService,
        int pageNumber = 1,
        int pageSize = 10) =>
        await ordersService.GetOrdersAsync(pageNumber, pageSize);

    /// <summary>
    /// Get orders for a specific customer
    /// </summary>
    public async Task<PaginatedOrdersType> GetOrdersByCustomerAsync(
        [Service] IOrdersGrpcService ordersService,
        string customerId,
        int pageNumber = 1,
        int pageSize = 10) =>
        await ordersService.GetOrdersByCustomerIdAsync(customerId, pageNumber, pageSize);
}

[ExtendObjectType(nameof(Mutation))]
public class OrdersMutation
{
    /// <summary>
    /// Create a new order
    /// </summary>
    public async Task<OrderType> CreateOrderAsync(
        [Service] IOrdersGrpcService ordersService,
        CreateOrderInput input) =>
        await ordersService.CreateOrderAsync(input);

    /// <summary>
    /// Add an item to an existing order
    /// </summary>
    public async Task<OrderType> AddItemToOrderAsync(
        [Service] IOrdersGrpcService ordersService,
        AddItemToOrderInput input) =>
        await ordersService.AddItemToOrderAsync(input);

    /// <summary>
    /// Remove an item from an order
    /// </summary>
    public async Task<OrderType> RemoveItemFromOrderAsync(
        [Service] IOrdersGrpcService ordersService,
        RemoveItemFromOrderInput input) =>
        await ordersService.RemoveItemFromOrderAsync(input);

    /// <summary>
    /// Update the quantity of an item in an order
    /// </summary>
    public async Task<OrderType> UpdateOrderItemQuantityAsync(
        [Service] IOrdersGrpcService ordersService,
        UpdateOrderItemQuantityInput input) =>
        await ordersService.UpdateOrderItemQuantityAsync(input);

    /// <summary>
    /// Update the status of an order
    /// </summary>
    public async Task<bool> UpdateOrderStatusAsync(
        [Service] IOrdersGrpcService ordersService,
        UpdateOrderStatusInput input) =>
        await ordersService.UpdateOrderStatusAsync(input);
}
