using Shared.Domain.ValueObjects;

namespace Orders.Domain.ValueObjects
{
    public sealed class ShipmentId : ValueObjectGuid
    {
        public ShipmentId() : base() { }
        public ShipmentId(Guid value) : base(value) { }

        public static implicit operator ShipmentId(Guid value) => new(value);
    }
}
