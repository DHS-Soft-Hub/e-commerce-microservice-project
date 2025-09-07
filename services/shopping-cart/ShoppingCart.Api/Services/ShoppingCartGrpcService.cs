using Grpc.Core;
using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
using ShoppingCart.Api.Commands.UpdateItemQuantityCommand;
using ShoppingCart.Api.Protos;
using ShoppingCart.Api.Queries;

namespace ShoppingCart.Api.Services;

public class ShoppingCartGrpcService : Protos.ShoppingCart.ShoppingCartBase
{
    private readonly IShoppingCartService _shoppingCartService;

    public ShoppingCartGrpcService(IShoppingCartService shoppingCartService)
    {
        _shoppingCartService = shoppingCartService;
    }

    public override async Task<GetCartResponse> GetCart(GetCartRequest request, ServerCallContext context)
    {
        var cart = await _shoppingCartService.GetCartAsync(new GetCartQuery(Guid.Parse(request.UserId), request.SessionId));
        return new GetCartResponse { Cart = ToProtoCart(cart, request.UserId, request.SessionId) };
    }

    public override async Task<AddToCartResponse> AddToCart(AddToCartRequest request, ServerCallContext context)
    {
        var cart = await _shoppingCartService.AddToCartAsync(new AddItemToCartCommand(
            Guid.Parse(request.UserId),
            request.SessionId,
            Guid.Parse(request.Item.ProductId),
            request.Item.ProductName,
            (decimal)request.Item.Price,
            request.Item.Currency,
            request.Item.Quantity
        ));
        return new AddToCartResponse { Cart = ToProtoCart(cart, request.UserId, request.SessionId) };
    }

    public override async Task<RemoveFromCartResponse> RemoveFromCart(RemoveFromCartRequest request, ServerCallContext context)
    {
        var cart = await _shoppingCartService.RemoveFromCartAsync(new RemoveItemFromCartCommand(
            Guid.Parse(request.UserId),
            request.SessionId,
            Guid.Parse(request.ItemId)
        ));
        return new RemoveFromCartResponse { Cart = ToProtoCart(cart, request.UserId, request.SessionId) };
    }

    public override async Task<UpdateItemQuantityResponse> UpdateItemQuantity(UpdateItemQuantityRequest request, ServerCallContext context)
    {
        var cart = await _shoppingCartService.UpdateToCartAsync(new UpdateItemQuantityCommand
        {
            UserId = Guid.Parse(request.UserId),
            SessionId = request.SessionId,
            ProductId = Guid.Parse(request.ItemId),
            Quantity = request.Quantity
        }, context.CancellationToken);
        return new UpdateItemQuantityResponse { Cart = ToProtoCart(cart, request.UserId, request.SessionId) };
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