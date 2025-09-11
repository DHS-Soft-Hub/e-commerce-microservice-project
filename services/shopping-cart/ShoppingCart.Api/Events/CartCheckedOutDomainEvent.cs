using Shared.Domain.Events;

namespace ShoppingCart.Api.Events;

public class CartCheckedOutDomainEvent : IDomainEvent
{
    public Guid CartId { get; }
    public Guid? UserId { get; }
    public string? SessionId { get; }

    public CartCheckedOutDomainEvent(Guid cartId, Guid? userId, string? sessionId)
    {
        CartId = cartId;
        UserId = userId;
        SessionId = sessionId;
    }
}