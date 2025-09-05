using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class CustomerId : ValueObjectGuid
    {
        public CustomerId() : base() { }
        public CustomerId(Guid value) : base(value) { }

        public static implicit operator CustomerId(Guid value) => new(value);
    }
}
