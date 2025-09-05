using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class OrderId : ValueObjectGuid
    {
        public OrderId() : base() { }
        public OrderId(Guid value) : base(value) { }

        public static implicit operator OrderId(Guid value) => new(value);
    }
}
