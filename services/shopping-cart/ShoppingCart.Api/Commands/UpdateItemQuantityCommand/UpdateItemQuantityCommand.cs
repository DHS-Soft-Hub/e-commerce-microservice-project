using MediatR;
using ShoppingCart.Api.Entities;

namespace ShoppingCart.Api.Commands.UpdateItemQuantityCommand;

public class UpdateItemQuantityCommand : IRequest<Cart>
{
    public Guid? UserId { get; set; }
    public string? SessionId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}
