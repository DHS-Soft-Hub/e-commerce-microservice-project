package ecommerce.userprofile.shared.domain;

import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.EventId;
import lombok.Getter;

import java.time.Instant;

/**
 * Abstract base implementation of DomainEvent.
 *
 * @version 1.0
 */
@Getter
public abstract class DomainEvent {

    private final EventId eventId;
    private final Instant occurredAt;
    private final AggregateId aggregateId;
    private final Long version;

    protected DomainEvent(AggregateId aggregateId, Long version) {
        this.eventId = new EventId();
        this.occurredAt = Instant.now();
        this.aggregateId = aggregateId;
        this.version = version;
    }
}
