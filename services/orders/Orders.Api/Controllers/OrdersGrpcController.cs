using Grpc.Core;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;
using Orders.Api.Grpc;
using Orders.Application.Services;

namespace Orders.Api.Controllers;

public class OrdersGrpcController : Orders.Api.Grpc.Orders.OrdersBase
{
    private readonly IOrderService _app;

    public OrdersGrpcController(IOrderService app)
    {
        _app = app;
    }

    public override async Task<CreateOrderResponse> CreateOrder(CreateOrderRequest request, ServerCallContext context)
    {
        var dto = new CreateOrderRequestDto
        (
            Guid.Parse(request.CustomerId),
            request.Items.Select(i => new CreateOrderItemRequestDto
            (
                Guid.Parse(i.ProductId),
                i.ProductName,
                i.Quantity,
                (decimal)i.UnitPrice,
                i.Currency
            )).ToList(),
            request.Currency
        );

        var response = await _app.CreateOrderAsync(dto, context.CancellationToken);
        
        // Get the full order details to return complete information
        var fullOrder = await _app.GetOrderAsync(response.Id, context.CancellationToken);
        return new CreateOrderResponse { Order = ResponseMap(fullOrder) };
    }

    public override async Task<GetOrderResponse> GetOrderById(GetOrderRequest request, ServerCallContext context)
    {
        var dto = await _app.GetOrderAsync(Guid.Parse(request.OrderId), context.CancellationToken);
        return new GetOrderResponse { Order = ResponseMap(dto) };
    }

    public override async Task<GetOrdersResponse> GetOrders(GetOrdersRequest request, ServerCallContext context)
    {
        var list = await _app.GetOrdersAsync(context.CancellationToken);
        var resp = new GetOrdersResponse();
        resp.Orders.AddRange(list.Select(ResponseMap));
        return resp;
    }

    public override async Task<AddItemToOrderResponse> AddItemToOrder(AddItemToOrderRequest request, ServerCallContext context)
    {
        var item = new CreateOrderItemRequestDto(
            Guid.Parse(request.Item.ProductId),
            request.Item.ProductName,
            request.Item.Quantity,
            (decimal)request.Item.UnitPrice,
            request.Item.Currency
        );

        var order = await _app.AddItemToOrderAsync(Guid.Parse(request.OrderId), item, context.CancellationToken);
        return new AddItemToOrderResponse { Order = ResponseMap(order) };
    }

    public override async Task<RemoveItemFromOrderResponse> RemoveItemFromOrder(RemoveItemFromOrderRequest request, ServerCallContext context)
    {
        var order = await _app.RemoveItemFromOrderAsync(
            Guid.Parse(request.OrderId), 
            Guid.Parse(request.ItemId), 
            context.CancellationToken);
        return new RemoveItemFromOrderResponse { Order = ResponseMap(order) };
    }

    public override async Task<UpdateOrderItemQuantityResponse> UpdateOrderItemQuantity(UpdateOrderItemQuantityRequest request, ServerCallContext context)
    {
        var order = await _app.UpdateOrderItemQuantityAsync(
            Guid.Parse(request.OrderId), 
            Guid.Parse(request.ItemId), 
            request.Quantity, 
            context.CancellationToken);
        return new UpdateOrderItemQuantityResponse { Order = ResponseMap(order) };
    }

    public override async Task<UpdateOrderStatusResponse> UpdateOrderStatus(UpdateOrderStatusRequest request, ServerCallContext context)
    {
        await _app.UpdateOrderStatusAsync(
            Guid.Parse(request.OrderId), 
            request.Status, 
            context.CancellationToken);
        return new UpdateOrderStatusResponse { Success = true };
    }

    private static Order ResponseMap(OrderDto dto)
    {
        var order = new Order
        {
            Id = dto.Id.ToString(),
            CustomerId = dto.CustomerId.ToString(),
            Currency = dto.Currency,
            Status = dto.Status,
            CreatedAt = dto.CreatedAt.Ticks,
            UpdatedAt = dto.UpdatedAt.Ticks,
            TotalAmount = (double)dto.Items.Sum(i => i.UnitPrice * i.Quantity)
        };

        order.Items.AddRange(dto.Items.Select(i => new OrderItem
        {
            Id = i.Id.ToString(),
            ProductId = i.ProductId.ToString(),
            ProductName = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = (double)i.UnitPrice,
            Currency = i.Currency
        }));

        return order;
    }

    private static OrderUpdate UpdateMap(OrderDto cmd)
    {
        var update = new OrderUpdate
        {
            Id = cmd.Id.ToString(),
            CustomerId = cmd.CustomerId.ToString(),
            Currency = cmd.Currency,
            Status = cmd.Status
        };

        update.Items.AddRange(cmd.Items.Select(i => new OrderItem
        {
            ProductId = i.ProductId.ToString(),
            ProductName = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = (double)i.UnitPrice,
            Currency = i.Currency
        }));

        return update;
    }

    
}