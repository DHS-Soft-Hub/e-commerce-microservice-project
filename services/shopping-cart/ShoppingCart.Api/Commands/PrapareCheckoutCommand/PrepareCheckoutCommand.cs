using MediatR;
using ShoppingCart.Api.Contracts.Responses;

namespace ShoppingCart.Api.Commands.PrepareCheckoutCommand;

public record PrepareCheckoutCommand(Guid UserId, string SessionId) : IRequest<CheckoutDataResponse>;
