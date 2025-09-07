using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class OrderItemId : ValueObjectGuid
    {
        public OrderItemId() : base() { }
        public OrderItemId(Guid value) : base(value) { }

        public static implicit operator OrderItemId(Guid value) => new(value);
    }
}
