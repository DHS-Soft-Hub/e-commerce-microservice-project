using Grpc.Core;
using Orders.Application.DTOs;
using Orders.Application.DTOs.Requests;
using Orders.Application.DTOs.Responses;
using Orders.Api.Grpc;
using Orders.Application.Services;

namespace Orders.Api.Contollers;

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
        return new CreateOrderResponse { Order = CreateMap(response) };
    }

    public override async Task<GetOrderResponse> GetOrder(GetOrderRequest request, ServerCallContext context)
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

    private static Order ResponseMap(OrderDto dto)
    {
        var order = new Order
        {
            Id = dto.Id.ToString(),
            CustomerId = dto.CustomerId.ToString(),
            Currency = dto.Currency,
        };

        order.Items.AddRange(dto.Items.Select(i => new OrderItem
        {
            ProductId = i.ProductId.ToString(),
            ProductName = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = (double)i.UnitPrice,
            Currency = i.Currency
        }));

        return order;
    }

    private static Order CreateMap(CreateOrderResponseDto dto)
    {
        var order = new Order
        {
            Id = dto.Id.ToString()
        };

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