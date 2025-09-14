using Shared.Domain.Entities;
using System.Text.Json.Serialization;

namespace Shared.Domain.Aggregates
{
    public abstract class AggregateRoot<TId> : BaseEntity<TId>
    where TId : notnull
    {
        [JsonConstructor]
        protected AggregateRoot() { }
        protected AggregateRoot(TId id) : base(id) { }
    }
}