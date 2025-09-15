using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class PaymentId : ValueObjectGuid
    {
        public PaymentId() : base() { }
        public PaymentId(Guid value) : base(value) { }

        public static implicit operator PaymentId(Guid value) => new(value);
    }
}
