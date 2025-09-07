namespace Shared.Domain.Events
{
    public interface IIntegrationEvent
    {
        Guid EventId { get; }
        DateTime OccurredOn { get; }
        string EventType { get; }
    }

    public abstract record BaseIntegrationEvent : IIntegrationEvent
    {
        public Guid EventId { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.UtcNow;
        public string EventType => GetType().Name;
    }
}