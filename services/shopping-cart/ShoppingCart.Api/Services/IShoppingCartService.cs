

using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.PrepareCheckoutCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
using ShoppingCart.Api.Commands.UpdateItemQuantityCommand;
using ShoppingCart.Api.DTOs;
using ShoppingCart.Api.Queries;

namespace ShoppingCart.Api.Services;

public interface IShoppingCartService
{
    Task<CartDto> GetCartAsync(GetCartQuery query, CancellationToken cancellationToken = default);
    Task<CartDto> AddToCartAsync(AddItemToCartCommand command, CancellationToken cancellationToken = default);
    Task<CartDto> RemoveFromCartAsync(RemoveItemFromCartCommand command, CancellationToken cancellationToken = default);
    Task<CartDto> UpdateToCartAsync(UpdateItemQuantityCommand command, CancellationToken cancellationToken = default);
    Task<CartDto> CheckoutAsync(PrepareCheckoutCommand command, CancellationToken cancellationToken = default);
}