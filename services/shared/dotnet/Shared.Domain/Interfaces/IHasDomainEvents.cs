using Shared.Domain.Events;

namespace Shared.Domain.Interfaces
{
    public interface IHasDomainEvents
    {
        IReadOnlyList<IDomainEvent> DomainEvents { get; }
        void ClearDomainEvents();
    }
}