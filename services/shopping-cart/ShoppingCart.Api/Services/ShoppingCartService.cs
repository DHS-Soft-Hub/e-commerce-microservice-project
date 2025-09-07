using MediatR;
using ShoppingCart.Api.Commands.AddItemToCartCommand;
using ShoppingCart.Api.Commands.PrepareCheckoutCommand;
using ShoppingCart.Api.Commands.RemoveItemFromCartCommand;
using ShoppingCart.Api.Commands.UpdateItemQuantityCommand;
using ShoppingCart.Api.DTOs;
using ShoppingCart.Api.Queries;

namespace ShoppingCart.Api.Services;


public class ShoppingCartService : IShoppingCartService
{
    private readonly ISender _mediator;

    public ShoppingCartService(ISender mediator)
    {
        _mediator = mediator;
    }

    public async Task<CartDto> AddToCartAsync(AddItemToCartCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command, cancellationToken);
        return await GetCartAsync(new GetCartQuery(command.UserId, command.SessionId), cancellationToken);
    }

    public async Task<CartDto> GetCartAsync(GetCartQuery query, CancellationToken cancellationToken = default)
    {
        return await _mediator.Send(query, cancellationToken);
    }

    public async Task<CartDto> RemoveFromCartAsync(RemoveItemFromCartCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command, cancellationToken);
        return await GetCartAsync(new GetCartQuery(command.UserId, command.SessionId), cancellationToken);
    }

    public async Task<CartDto> UpdateToCartAsync(UpdateItemQuantityCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command, cancellationToken);
        return await GetCartAsync(new GetCartQuery(command.UserId, command.SessionId), cancellationToken);
    }
    
    public async Task<CartDto> CheckoutAsync(PrepareCheckoutCommand command, CancellationToken cancellationToken = default)
    {
        await _mediator.Send(command, cancellationToken);
        return await GetCartAsync(new GetCartQuery(command.UserId, null), cancellationToken);
    }
}