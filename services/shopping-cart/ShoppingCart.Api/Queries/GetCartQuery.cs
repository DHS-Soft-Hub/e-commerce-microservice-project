using MediatR;
using ShoppingCart.Api.DTOs;

namespace ShoppingCart.Api.Queries;

public record GetCartQuery(Guid? UserId, string? SessionId) : IRequest<CartDto?>;

