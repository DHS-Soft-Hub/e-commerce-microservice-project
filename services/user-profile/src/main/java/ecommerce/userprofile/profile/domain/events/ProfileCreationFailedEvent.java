package ecommerce.userprofile.profile.domain.events;

import ecommerce.userprofile.shared.domain.DomainEvent;
import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.UserId;
import lombok.Getter;

/**
 * Domain event raised when profile creation fails.
 */
@Getter
public class ProfileCreationFailedEvent extends DomainEvent {
    private final UserId userId;
    private final String reason;

    public ProfileCreationFailedEvent(AggregateId aggregateId, Long aggregateVersion, UserId userId, String reason) {
        super(aggregateId, aggregateVersion);
        this.userId = userId;
        this.reason = reason;
    }
}
