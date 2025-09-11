package ecommerce.userprofile.shared.domain.aggregate;

import ecommerce.userprofile.shared.domain.DomainEvent;
import ecommerce.userprofile.shared.domain.entities.DomainEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Abstract base class for Aggregate Roots in DDD.
 * An Aggregate Root controls access to its internal entities and maintains consistency.
 *
 * @param <ID> The type of the aggregate's identifier
 * @version 1.0
 */
@Getter
@EqualsAndHashCode
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class AggregateRoot<ID> {

    protected ID id;
    private Long version;
    private Instant createdAt;
    private Instant updatedAt;

    private final Queue<DomainEvent> domainEvents = new ConcurrentLinkedQueue<>();
    private final Map<Class<? extends DomainEntity<?>>, Set<DomainEntity<?>>> entities = new HashMap<>();

    protected void incrementVersion() {
        this.version++;
        this.updatedAt = Instant.now();
    }

    /**
     * Adds a domain event to be published later.
     */
    protected void addDomainEvent(DomainEvent event) {
        domainEvents.offer(event);
    }

    /**
     * Gets all pending domain events.
     */
    public List<DomainEvent> getDomainEvents() {
        return new ArrayList<>(domainEvents);
    }

    /**
     * Clears all pending domain events.
     */
    public void clearDomainEvents() {
        domainEvents.clear();
    }

    /**
     * Checks if there are any pending domain events.
     */
    public boolean hasDomainEvents() {
        return !domainEvents.isEmpty();
    }

    /**
     * Marks the aggregate as changed and increments version.
     * Should be called whenever the aggregate state changes.
     */
    protected void markAsChanged() {
        incrementVersion();
    }
}
