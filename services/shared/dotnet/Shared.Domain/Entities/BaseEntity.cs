using System;
using System.Collections.Generic;
using Shared.Domain.Events;
using Shared.Domain.Interfaces;

namespace Shared.Domain.Entities;

public abstract class BaseEntity<TId> : IEquatable<BaseEntity<TId>>, IHasDomainEvents
    where TId : notnull
{
    // For EF Core
    protected BaseEntity() { }

    protected BaseEntity(TId id) => Id = id;

    public TId Id { get; protected set; } = default!;

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (ReferenceEquals(this, obj)) return true;
        if (obj.GetType() != GetType()) return false;

        var other = (BaseEntity<TId>)obj;
        return EqualityComparer<TId>.Default.Equals(Id, other.Id);
    }

    public bool Equals(BaseEntity<TId>? other) => Equals((object?)other);

    public static bool operator ==(BaseEntity<TId>? left, BaseEntity<TId>? right) => Equals(left, right);
    public static bool operator !=(BaseEntity<TId>? left, BaseEntity<TId>? right) => !Equals(left, right);

    public override int GetHashCode() => HashCode.Combine(GetType(), Id);

    // Domain Events
    private readonly List<IDomainEvent> _domainEvents = new();
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(IDomainEvent eventItem) => _domainEvents.Add(eventItem);
    protected bool RemoveDomainEvent(IDomainEvent eventItem) => _domainEvents.Remove(eventItem);

    public IReadOnlyCollection<IDomainEvent> PullDomainEvents()
    {
        var events = _domainEvents.ToArray();
        _domainEvents.Clear();
        return events;
    }

    public void ClearDomainEvents() => _domainEvents.Clear();
}