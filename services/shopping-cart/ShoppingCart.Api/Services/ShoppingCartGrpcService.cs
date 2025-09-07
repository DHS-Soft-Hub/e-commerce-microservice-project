using Grpc.Core;
using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
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
        return new GetCartResponse { Cart = ToProtoCart(cart) };
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
        return new AddToCartResponse { Cart = ToProtoCart(cart) };
    }

    public override async Task<RemoveFromCartResponse> RemoveFromCart(RemoveFromCartRequest request, ServerCallContext context)
    {
        var cart = await _shoppingCartService.RemoveFromCartAsync(new RemoveItemFromCartCommand(
            Guid.Parse(request.UserId),
            request.SessionId,
            Guid.Parse(request.ItemId)
        ));
        return new RemoveFromCartResponse { Cart = ToProtoCart(cart) };
    }

    private static Cart ToProtoCart(DTOs.CartDto item)
    {
        return new Cart
        {
            Items = { item.Items.Select(ToProtoCartItem) }
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