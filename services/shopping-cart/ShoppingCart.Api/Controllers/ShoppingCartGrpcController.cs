using Grpc.Core;
using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.PrepareCheckoutCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
using ShoppingCart.Api.Commands.UpdateItemQuantityCommand;
using ShoppingCart.Api.Protos;
using ShoppingCart.Api.Queries;

namespace ShoppingCart.Api.Services;

public class ShoppingCartGrpcController : Protos.ShoppingCart.ShoppingCartBase
{
    private readonly IShoppingCartService _shoppingCartService;

    public ShoppingCartGrpcController(IShoppingCartService shoppingCartService)
    {
        _shoppingCartService = shoppingCartService;
    }

    public override async Task<GetCartResponse> GetCart(GetCartRequest request, ServerCallContext context)
    {
        var userId = String.IsNullOrEmpty(request.UserId) ? (Guid?)null : Guid.Parse(request.UserId);
        var sessionId = String.IsNullOrEmpty(request.SessionId) ? null : request.SessionId;
        if (userId == null && sessionId == null)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Either UserId or SessionId must be provided."));
        }
        var cart = await _shoppingCartService.GetCartAsync(new GetCartQuery(userId, sessionId));
        return new GetCartResponse { Cart = ToProtoCart(cart, userId?.ToString() ?? string.Empty, sessionId ?? string.Empty) };
    }

    public override async Task<AddToCartResponse> AddToCart(AddToCartRequest request, ServerCallContext context)
    {
        Guid? userId = String.IsNullOrEmpty(request.UserId) ? null : 
            (Guid.TryParse(request.UserId, out var parsedUserId) ? parsedUserId : null);
        var sessionId = String.IsNullOrEmpty(request.SessionId) ? null : request.SessionId;
        if (userId == null && sessionId == null)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Either UserId or SessionId must be provided."));
        }
        var cart = await _shoppingCartService.AddToCartAsync(new AddItemToCartCommand(
            userId,
            sessionId,
            Guid.Parse(request.Item.ProductId),
            request.Item.ProductName,
            (decimal)request.Item.Price,
            request.Item.Currency,
            request.Item.Quantity
        ));
        return new AddToCartResponse { Cart = ToProtoCart(cart, userId?.ToString() ?? string.Empty, sessionId ?? string.Empty) };
    }

    public override async Task<RemoveFromCartResponse> RemoveFromCart(RemoveFromCartRequest request, ServerCallContext context)
    {
        var userId = String.IsNullOrEmpty(request.UserId) ? null : 
            (Guid.TryParse(request.UserId, out var parsedUserId) ? parsedUserId : (Guid?)null);
        var sessionId = String.IsNullOrEmpty(request.SessionId) ? null : request.SessionId;
        if (userId == null && sessionId == null)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Either UserId or SessionId must be provided."));
        }
        var cart = await _shoppingCartService.RemoveFromCartAsync(new RemoveItemFromCartCommand(
            userId,
            sessionId,
            Guid.Parse(request.ItemId)
        ));
        return new RemoveFromCartResponse { Cart = ToProtoCart(cart, userId?.ToString() ?? string.Empty, sessionId ?? string.Empty) };
    }

    public override async Task<UpdateItemQuantityResponse> UpdateItemQuantity(UpdateItemQuantityRequest request, ServerCallContext context)
    {
        var userId = String.IsNullOrEmpty(request.UserId) ? null : 
            (Guid.TryParse(request.UserId, out var parsedUserId) ? parsedUserId : (Guid?)null);
        var sessionId = String.IsNullOrEmpty(request.SessionId) ? null : request.SessionId;
        if (userId == null && sessionId == null)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Either UserId or SessionId must be provided."));
        }
        var cart = await _shoppingCartService.UpdateToCartAsync(new UpdateItemQuantityCommand
        {
            UserId = userId,
            SessionId = sessionId,
            ProductId = Guid.Parse(request.ItemId),
            Quantity = request.Quantity
        }, context.CancellationToken);
        return new UpdateItemQuantityResponse { Cart = ToProtoCart(cart, userId?.ToString() ?? string.Empty, sessionId ?? string.Empty) };
    }

    public override async Task<CheckoutResponse> Checkout(CheckoutRequest request, ServerCallContext context)
    {
        var userId = String.IsNullOrEmpty(request.UserId) ? null : 
            (Guid.TryParse(request.UserId, out var parsedUserId) ? parsedUserId : (Guid?)null);
        var sessionId = String.IsNullOrEmpty(request.SessionId) ? null : request.SessionId;
        if (userId == null && sessionId == null)
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Either UserId or SessionId must be provided."));
        }
        var result = await _shoppingCartService.CheckoutAsync(new PrepareCheckoutCommand(
            userId,
            sessionId
        ), context.CancellationToken);
        
        return new CheckoutResponse 
        { 
            OrderId = result.OrderId?.ToString() ?? string.Empty,
            Success = result.Success,
            Message = result.Message ?? string.Empty
        };
    }

    private static Cart ToProtoCart(DTOs.CartDto item, string userId, string sessionId)
    {
        return new Cart
        {
            UserId = userId,
            SessionId = sessionId,
            Items = { item.Items.Select(ToProtoCartItem) },
            TotalPrice = (float)item.TotalPrice,
            Currency = item.Currency
        };
    }

    private static CartItem ToProtoCartItem(DTOs.CartItemDto item)
    {
        return new CartItem
        {
            ProductId = item.ProductId.ToString(),
            ProductName = item.ProductName,
            Quantity = item.Quantity,
            Price = (float)item.Price,
            Currency = item.Currency
        };
    }
}