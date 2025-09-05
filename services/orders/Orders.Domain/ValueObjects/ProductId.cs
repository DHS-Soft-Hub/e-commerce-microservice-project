using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class ProductId : ValueObjectGuid
    {
        public ProductId() : base() { }
        public ProductId(Guid value) : base(value) { }

        public static implicit operator ProductId(Guid value) => new(value);
    }
}
