using ApiGateway.Queries.ShoppingCart;
using ApiGateway.Services;
using HotChocolate;

namespace ApiGateway.Queries.ShoppingCart;

[ExtendObjectType(nameof(Query))]
public class ShoppingCartQuery
{
    /// <summary>
    /// Get shopping cart for a user
    /// </summary>
    [GraphQLName("getCart")]
    public async Task<CartType> GetCartAsync(
        [Service] IShoppingCartGrpcService shoppingCartService,
        string userId,
        string sessionId) =>
        await shoppingCartService.GetCartAsync(userId, sessionId);
}

[ExtendObjectType(nameof(Mutation))]
public class ShoppingCartMutation
{
    /// <summary>
    /// Add an item to the shopping cart
    /// </summary>
    [GraphQLName("addToCart")]
    public async Task<CartType> AddToCartAsync(
        [Service] IShoppingCartGrpcService shoppingCartService,
        AddToCartInput input) =>
        await shoppingCartService.AddToCartAsync(input);

    /// <summary>
    /// Remove an item from the shopping cart
    /// </summary>
    [GraphQLName("removeFromCart")]
    public async Task<CartType> RemoveFromCartAsync(
        [Service] IShoppingCartGrpcService shoppingCartService,
        RemoveFromCartInput input) =>
        await shoppingCartService.RemoveFromCartAsync(input);

    /// <summary>
    /// Update the quantity of an item in the shopping cart
    /// </summary>
    [GraphQLName("updateItemQuantity")]
    public async Task<CartType> UpdateItemQuantityAsync(
        [Service] IShoppingCartGrpcService shoppingCartService,
        UpdateItemQuantityInput input) =>
        await shoppingCartService.UpdateItemQuantityAsync(input);

    /// <summary>
    /// Proceed to checkout with the shopping cart
    /// </summary>
    [GraphQLName("checkout")]
    public async Task<CheckoutResultType> CheckoutAsync(
        [Service] IShoppingCartGrpcService shoppingCartService,
        CheckoutInput input) =>
        await shoppingCartService.CheckoutAsync(input);
}
