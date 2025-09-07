using System;
using System.Collections.Generic;
using System.Linq;

namespace Shared.Domain.ValueObjects
{
    public abstract class ValueObject : IEquatable<ValueObject>
    {
        protected abstract IEnumerable<object?> GetEqualityComponents();

        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;

            var other = (ValueObject)obj;
            return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
        }

        public bool Equals(ValueObject? other) => Equals((object?)other);

        public override int GetHashCode()
        {
            return GetEqualityComponents()
                .Aggregate(GetType().GetHashCode(), (current, component) =>
                    HashCode.Combine(current, component?.GetHashCode() ?? 0));
        }

        public static bool operator ==(ValueObject? left, ValueObject? right) => Equals(left, right);
        public static bool operator !=(ValueObject? left, ValueObject? right) => !Equals(left, right);
    }
}