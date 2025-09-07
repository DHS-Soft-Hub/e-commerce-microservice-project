namespace Shared.Domain.ValueObjects
{
    public abstract class ValueObject<T> where T : notnull
    {
        public override bool Equals(object? obj)
        {
            if (obj is not ValueObject<T> other)
                return false;

            return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
        }

        public override int GetHashCode()
        {
            return GetEqualityComponents()
                .Aggregate(1, (current, obj) => HashCode.Combine(current, obj.GetHashCode()));
        }

        protected abstract IEnumerable<object> GetEqualityComponents();
    }
}