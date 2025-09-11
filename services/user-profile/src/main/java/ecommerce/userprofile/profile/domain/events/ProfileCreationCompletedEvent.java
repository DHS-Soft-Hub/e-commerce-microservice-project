package ecommerce.userprofile.profile.domain.events;

import ecommerce.userprofile.profile.domain.valueobjects.ProfileId;
import ecommerce.userprofile.shared.domain.DomainEvent;
import ecommerce.userprofile.shared.domain.valueobject.AggregateId;
import ecommerce.userprofile.shared.domain.valueobject.UserId;
import lombok.Getter;

/**
 * Domain event raised when profile creation is completed successfully.
 */
@Getter
public class ProfileCreationCompletedEvent extends DomainEvent {

    private final UserId userId;
    private final ProfileId profileId;

    public ProfileCreationCompletedEvent(
            AggregateId aggregateId,
            Long aggregateVersion,
            UserId userId,
            ProfileId profileId
    ) {
        super(aggregateId, aggregateVersion);
        this.userId = userId;
        this.profileId = profileId;
    }

}
