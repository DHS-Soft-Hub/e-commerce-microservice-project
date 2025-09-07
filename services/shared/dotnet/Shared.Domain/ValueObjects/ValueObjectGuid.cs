namespace Shared.Domain.ValueObjects
{
    public abstract class ValueObjectGuid : ValueObject<Guid>
    {
        public Guid Value { get; private set; }

        protected ValueObjectGuid()
        {
            Value = Guid.NewGuid();
        }

        protected ValueObjectGuid(Guid value)
        {
            if (value == Guid.Empty)
                throw new ArgumentException("GUID cannot be empty", nameof(value));

            Value = value;
        }

        public static implicit operator Guid(ValueObjectGuid valueObject) => valueObject.Value;
        
        public override string ToString() => Value.ToString();

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

    }
}
