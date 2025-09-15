using Web.Services.Cart.DTOs;
using Web.Services.Cart.Queries;
using Web.Services.Cart.Mutations;
using Web.Services.Shared;

namespace Web.Services.Cart
{
    public class CartService
    {
        private readonly GraphQLClient _graphQLClient;
        private readonly ILogger<CartService> _logger;

        public CartService(GraphQLClient graphQLClient, ILogger<CartService> logger)
        {
            _graphQLClient = graphQLClient;
            _logger = logger;
        }

        public async Task<CartDto?> GetCartAsync(string userId, string sessionId)
        {
            try
            {
                var variables = new { userId, sessionId };
                var response = await _graphQLClient.QueryAsync<CartQueryResponse>(CartQueries.GetCart, variables);
                return response?.Cart;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cart for user {UserId}", userId);
                return null;
            }
        }

        public async Task<CartDto?> AddToCartAsync(AddToCartInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<CartMutationResponse>(CartMutations.AddToCart, variables);
                return response?.Cart;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to cart for user {UserId}", input.UserId);
                return null;
            }
        }

        public async Task<CartDto?> RemoveFromCartAsync(RemoveFromCartInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<CartMutationResponse>(CartMutations.RemoveFromCart, variables);
                return response?.Cart;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from cart for user {UserId}", input.UserId);
                return null;
            }
        }

        public async Task<CartDto?> UpdateItemQuantityAsync(UpdateItemQuantityInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<CartMutationResponse>(CartMutations.UpdateItemQuantity, variables);
                return response?.Cart;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating item quantity in cart for user {UserId}", input.UserId);
                return null;
            }
        }

        public async Task<CheckoutResultDto?> CheckoutAsync(CheckoutInput input)
        {
            try
            {
                var variables = new { input };
                var response = await _graphQLClient.MutateAsync<CheckoutMutationResponse>(CartMutations.Checkout, variables);
                return response?.Result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during checkout for user {UserId}", input.UserId);
                return null;
            }
        }
    }

    // Response wrapper classes for GraphQL
    public class CartQueryResponse
    {
        public CartDto Cart { get; set; } = new();
    }

    public class CartMutationResponse
    {
        public CartDto Cart { get; set; } = new();
    }

    public class CheckoutMutationResponse
    {
        public CheckoutResultDto Result { get; set; } = new();
    }
}
