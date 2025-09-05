using Shared.Domain.Entities;

namespace Shared.Domain.Aggregates
{
    public abstract class AggregateRoot<TId> : BaseEntity<TId>
    where TId : notnull
    {
        protected AggregateRoot(TId id) : base(id)
        {
        }
    }
}