using Grpc.Core;
using Orders.Application.Commands;
using Orders.Application.DTOs;
using Orders.Application.Grpc;

namespace Orders.Application.Services;

public class OrdersGrpcService : Orders.Application.Grpc.Orders.OrdersBase
{
    private readonly OrderService _app;

    public OrdersGrpcService(OrderService app)
    {
        _app = app;
    }

    public override async Task<CreateOrderResponse> CreateOrder(CreateOrderRequest request, ServerCallContext context)
    {
        var cmd = new CreateOrderCommand
        {
            CustomerId = Guid.Parse(request.CustomerId),
            Currency = request.Currency,
            Items = request.Items.Select(i => new CreateOrderItemDto
            {
                ProductId = Guid.Parse(i.ProductId),
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                Price = (decimal)i.UnitPrice,
                Currency = i.Currency
            }).ToList()
        };

        var dto = await _app.CreateOrderAsync(cmd, context.CancellationToken);
        return new CreateOrderResponse { Order = Map(dto) };
    }

    public override async Task<GetOrderResponse> GetOrder(GetOrderRequest request, ServerCallContext context)
    {
        var dto = await _app.GetOrderAsync(Guid.Parse(request.OrderId), context.CancellationToken);
        return new GetOrderResponse { Order = Map(dto) };
    }

    public override async Task<GetOrdersResponse> GetOrders(GetOrdersRequest request, ServerCallContext context)
    {
        var list = await _app.GetOrdersAsync(context.CancellationToken);
        var resp = new GetOrdersResponse();
        resp.Orders.AddRange(list.Select(Map));
        return resp;
    }

    private static Order Map(OrderDto dto)
    {
        var order = new Order
        {
            Id = dto.Id.ToString(),
            CustomerId = dto.CustomerId.ToString(),
            TotalPrice = (double)dto.TotalPrice,
            Currency = dto.Currency,
            Status = dto.Status,
            CreatedAt = dto.CreatedAt.ToString("o")
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

    
}