package ecommerce.userprofile.shared.domain;

import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.EventId;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public abstract class DomainEvent {

    private final EventId eventId;
    private final LocalDateTime occurredAt;
    private final AggregateId aggregateId;

    protected DomainEvent(AggregateId aggregateId) {
        this.eventId = new EventId();
        this.occurredAt = LocalDateTime.now();
        this.aggregateId = aggregateId;
    }
}
