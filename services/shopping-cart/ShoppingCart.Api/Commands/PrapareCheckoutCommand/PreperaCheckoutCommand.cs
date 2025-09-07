using MediatR;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Commands.PrepareCheckoutCommand;

public record PrepareCheckoutCommand(Guid UserId) : IRequest<CheckoutData>;
