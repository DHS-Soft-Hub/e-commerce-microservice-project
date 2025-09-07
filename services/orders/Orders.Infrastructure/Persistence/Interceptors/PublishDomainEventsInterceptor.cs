using MediatR;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Orders.Infrastructure.Persistence.Interceptors
{
    public class PublishDomainEventsInterceptor : SaveChangesInterceptor
    {
        private readonly IPublisher _mediator;

        public PublishDomainEventsInterceptor(IPublisher mediator)
        {
            _mediator = mediator;
        }

        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            var context = eventData.Context;

            if (context == null) return await base.SavingChangesAsync(eventData, result, cancellationToken);

            // Get all aggregate roots with domain events
            var domainEntities = context.ChangeTracker
                .Entries<Shared.Domain.Interfaces.IHasDomainEvents>()
                .Where(x => x.Entity.DomainEvents != null && x.Entity.DomainEvents.Any())
                .ToList();

            // Get all domain events
            var domainEvents = domainEntities
                .SelectMany(x => x.Entity.DomainEvents!)
                .ToList();

            // Clear domain events
            domainEntities.ForEach(entity => entity.Entity.ClearDomainEvents());

            // Publish domain events
            foreach (var domainEvent in domainEvents)
            {
                await _mediator.Publish(domainEvent, cancellationToken);
            }

            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}