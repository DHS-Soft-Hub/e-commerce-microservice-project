
using Shared.Domain.Events;
using Shared.Domain.Interfaces;

namespace Shared.Domain.Entities;


public abstract class BaseEntity<TId> : IEquatable<BaseEntity<TId>>, IHasDomainEvents
where TId : notnull
{
    public TId Id { get; protected set; } = default!;

    public BaseEntity(TId id)
    {
        Id = id;
    }

    public override bool Equals(object? obj)
    {
        return obj is BaseEntity<TId> entity && Id.Equals(entity.Id);
    }

    public static bool operator ==(BaseEntity<TId>? left, BaseEntity<TId>? right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(BaseEntity<TId>? left, BaseEntity<TId>? right)
    {
        return !Equals(left, right);
    }

    // IEquatable<BaseEntity<TId>>
    public bool Equals(BaseEntity<TId>? other)
    {
        return Equals((object?)other);
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    // Domain Events
    private readonly List<IDomainEvent> _domainEvents = new();

    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent eventItem)
    {
        _domainEvents.Add(eventItem);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}