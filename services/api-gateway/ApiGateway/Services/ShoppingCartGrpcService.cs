using ShoppingCart.Api.Protos;
using ApiGateway.Queries.ShoppingCart;
using Grpc.Net.Client;

namespace ApiGateway.Services;

public interface IShoppingCartGrpcService
{
    Task<CartType> GetCartAsync(string userId, string sessionId);
    Task<CartType> AddToCartAsync(AddToCartInput input);
    Task<CartType> RemoveFromCartAsync(RemoveFromCartInput input);
    Task<CartType> UpdateItemQuantityAsync(UpdateItemQuantityInput input);
    Task<CheckoutResultType> CheckoutAsync(CheckoutInput input);
}

public class ShoppingCartGrpcService : IShoppingCartGrpcService
{
    private readonly ShoppingCart.Api.Protos.ShoppingCart.ShoppingCartClient _client;
    private readonly ILogger<ShoppingCartGrpcService> _logger;

    public ShoppingCartGrpcService(IConfiguration configuration, ILogger<ShoppingCartGrpcService> logger)
    {
        _logger = logger;
        var shoppingCartServiceUrl = configuration["GrpcServices:ShoppingCart"] ?? "https://localhost:7003";
        var channel = GrpcChannel.ForAddress(shoppingCartServiceUrl);
        _client = new ShoppingCart.Api.Protos.ShoppingCart.ShoppingCartClient(channel);
    }

    public async Task<CartType> GetCartAsync(string userId, string sessionId)
    {
        try
        {
            var request = new GetCartRequest
            {
                UserId = userId,
                SessionId = sessionId
            };

            var response = await _client.GetCartAsync(request);
            return MapToCartType(response.Cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart for user: {UserId}", userId);
            throw;
        }
    }

    public async Task<CartType> AddToCartAsync(AddToCartInput input)
    {
        try
        {
            var request = new AddToCartRequest
            {
                UserId = input.UserId,
                SessionId = input.SessionId,
                Item = new CartItem
                {
                    ProductId = input.Item.ProductId,
                    ProductName = input.Item.ProductName,
                    Quantity = input.Item.Quantity,
                    Price = (float)input.Item.Price,
                    Currency = input.Item.Currency
                }
            };

            var response = await _client.AddToCartAsync(request);
            return MapToCartType(response.Cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding item to cart");
            throw;
        }
    }

    public async Task<CartType> RemoveFromCartAsync(RemoveFromCartInput input)
    {
        try
        {
            var request = new RemoveFromCartRequest
            {
                UserId = input.UserId,
                SessionId = input.SessionId,
                ItemId = input.ItemId
            };

            var response = await _client.RemoveFromCartAsync(request);
            return MapToCartType(response.Cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing item from cart");
            throw;
        }
    }

    public async Task<CartType> UpdateItemQuantityAsync(UpdateItemQuantityInput input)
    {
        try
        {
            var request = new UpdateItemQuantityRequest
            {
                UserId = input.UserId,
                SessionId = input.SessionId,
                ItemId = input.ItemId,
                Quantity = input.Quantity
            };

            var response = await _client.UpdateItemQuantityAsync(request);
            return MapToCartType(response.Cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating item quantity in cart");
            throw;
        }
    }

    public async Task<CheckoutResultType> CheckoutAsync(CheckoutInput input)
    {
        try
        {
            var request = new CheckoutRequest
            {
                UserId = input.UserId,
                SessionId = input.SessionId
            };

            var response = await _client.CheckoutAsync(request);
            return new CheckoutResultType
            {
                OrderId = response.OrderId,
                Success = response.Success,
                Message = response.Message
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during checkout");
            throw;
        }
    }

    private static CartType MapToCartType(Cart cart)
    {
        return new CartType
        {
            UserId = cart.UserId,
            SessionId = cart.SessionId,
            TotalPrice = (decimal)cart.TotalPrice,
            Currency = cart.Currency,
            Items = cart.Items.Select(item => new CartItemType
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                Price = (decimal)item.Price,
                Currency = item.Currency
            }).ToList()
        };
    }
}
